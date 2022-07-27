import { EffectTypeAndRange } from '@foundryvtt-dndmashup/mashup-react';
import { MeasuredTemplateDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/measuredTemplateData';
import { systemName } from './constants';

type MeasuredTemplateFactory<T extends EffectTypeAndRange['type'] = EffectTypeAndRange['type']> = {
	create: (typeAndRange: EffectTypeAndRange & { type: T }) => MeasuredTemplateDocument | null;
};

type MeasuredTemplateSystemFlags = {
	rotate: [square: number, other: number];
};

const byEffectType: { [K in EffectTypeAndRange['type']]?: MeasuredTemplateFactory<K> } = {
	close: {
		create(effect) {
			const user = (game as Game).user ?? null;

			if (!user) return null;
			const data: MeasuredTemplateDataConstructorData = {
				t: 'rect',
				user: user.id,
				// distance + direction is the angle of the rectangle
				distance: effect.size * Math.SQRT2,
				direction: -45,
				x: 0,
				y: 0,
				fillColor: user.color,
				flags: { [systemName]: { rotate: [90, 60] } },
			};
			const cls = CONFIG.MeasuredTemplate.documentClass;
			return new cls(data, { parent: canvas?.scene ?? undefined });
		},
	},
};

export class PowerEffectTemplate extends MeasuredTemplate {
	static canCreate(typeAndRange: EffectTypeAndRange) {
		return byEffectType[typeAndRange.type] ? true : false;
	}

	static fromTypeAndRange(typeAndRange: EffectTypeAndRange) {
		const template = (byEffectType[typeAndRange.type] as MeasuredTemplateFactory)?.create(typeAndRange);
		if (template === null) return null;
		const object = new this(template);
		return object;
	}

	drawPreview() {
		const initialLayer = canvas?.activeLayer;
		if (!initialLayer) return;
		this.layer.activate();
		this.draw();
		if (!this.layer.preview) return;
		this.layer.preview.addChild(this);
		this.activatePreviewListeners(initialLayer, this.layer.preview);
	}

	activatePreviewListeners(initialLayer: CanvasLayer, previewLayer: PIXI.Container) {
		const handlers: {
			mouseMove?: (event: MouseEvent) => void;
			mouseWheel?: (event: WheelEvent) => void;
			leftClick?: (event: MouseEvent) => void;
			rightClick?: (event: MouseEvent) => void;
		} = {};
		let moveTime = 0;

		const grid = canvas?.grid;
		const scene = canvas?.scene;
		const stage = canvas?.stage;
		const app = canvas?.app;
		if (!grid || !scene || !stage || !app) return;

		// Update placement (mouse-move)
		handlers.mouseMove = (event) => {
			event.stopPropagation();
			const now = Date.now(); // Apply a 20ms throttle
			if (now - moveTime <= 20) return;
			const center = (event as any).data.getLocalPosition(this.layer);
			const snapped = grid.getSnappedPosition(center.x, center.y, 1);
			this.data.update({ x: snapped.x, y: snapped.y });
			this.refresh();
			moveTime = now;
		};

		// Cancel the workflow (right-click)
		handlers.rightClick = (event) => {
			previewLayer.removeChild(this);
			this.destroy();
			stage.off('mousemove', handlers.mouseMove);
			stage.off('mousedown', handlers.leftClick);
			app.view.oncontextmenu = null;
			app.view.onwheel = null;
			initialLayer.activate();
		};

		// Confirm the workflow (left-click)
		handlers.leftClick = (event) => {
			handlers.rightClick?.(event);
			const destination = grid.getSnappedPosition(this.data.x, this.data.y, 1);
			this.data.update(destination);
			scene.createEmbeddedDocuments('MeasuredTemplate', [this.data as never]);
		};

		handlers.mouseWheel = (event) => {
			if (event.ctrlKey) event.preventDefault(); // Avoid zooming the browser window
			event.stopPropagation();

			const rotate = (this.data.flags?.[systemName] as MeasuredTemplateSystemFlags)?.rotate;
			if (rotate) {
				const delta = grid.type === CONST.GRID_TYPES.SQUARE ? rotate[0] : rotate[1];
				console.log(rotate, delta, grid.type);
				this.data.update({ direction: this.data.direction + delta * Math.sign(event.deltaY) });
				this.refresh();
			}
		};

		// Activate listeners
		stage.on('mousemove', handlers.mouseMove);
		stage.on('mousedown', handlers.leftClick);
		app.view.oncontextmenu = handlers.rightClick;
		app.view.onwheel = handlers.mouseWheel;
	}
}
