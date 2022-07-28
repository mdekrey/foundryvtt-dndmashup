import { EffectTypeAndRange, Size, sizeToTokenSize } from '@foundryvtt-dndmashup/mashup-react';
import { MeasuredTemplateDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/measuredTemplateData';
import { systemName } from './constants';

type MeasuredTemplateFactory<T extends EffectTypeAndRange['type'] = EffectTypeAndRange['type']> = {
	create: (typeAndRange: EffectTypeAndRange & { type: T }, size: Size) => MeasuredTemplateDataConstructorData | null;
};

type MeasuredTemplateSystemFlags = {
	rotate?: number;
	closeBurst?: Size;
};

const byEffectType: { [K in EffectTypeAndRange['type']]?: MeasuredTemplateFactory<K> } = {
	close: {
		create(effect, actorSize) {
			return effect.shape === 'blast'
				? {
						t: 'rect',
						// distance + direction is the angle of the rectangle
						distance: effect.size * Math.SQRT2,
						direction: -45,
						flags: { [systemName]: { rotate: 90, closeBurst: undefined } },
				  }
				: {
						t: 'circle',
						distance: effect.size + sizeToTokenSize[actorSize] / 2,
						direction: 0,
						flags: { [systemName]: { rotate: undefined, closeBurst: actorSize } },
				  };
		},
	},
	area: {
		create(effect) {
			return effect.shape === 'burst'
				? {
						t: 'circle',
						distance: effect.size + 0.5,
						direction: 0,
						flags: { [systemName]: { rotate: undefined } },
				  }
				: null;
		},
	},
};

export class PowerEffectTemplate extends MeasuredTemplate {
	static canCreate(typeAndRange: EffectTypeAndRange) {
		return (byEffectType[typeAndRange.type] as MeasuredTemplateFactory | undefined)?.create(typeAndRange, 'medium')
			? true
			: false;
	}

	static fromTypeAndRange(typeAndRange: EffectTypeAndRange, actorSize: Size) {
		const user = (game as Game).user ?? null;

		if (!user) return null;

		const partialData = {
			user: user.id,
			x: 0,
			y: 0,
			fillColor: user.color,
		};

		const constructorData = (byEffectType[typeAndRange.type] as MeasuredTemplateFactory)?.create(
			typeAndRange,
			actorSize
		);
		if (constructorData === null) return null;

		const cls = CONFIG.MeasuredTemplate.documentClass;
		const template = new cls({ ...partialData, ...constructorData }, { parent: canvas?.scene ?? undefined });

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

		const snapSize = 2;

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
			const snapped = grid.getSnappedPosition(center.x, center.y, snapSize);
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
			const destination = grid.getSnappedPosition(this.data.x, this.data.y, snapSize);
			this.data.update(destination);
			scene.createEmbeddedDocuments('MeasuredTemplate', [this.data as never]);
		};

		handlers.mouseWheel = (event) => {
			if (event.ctrlKey) event.preventDefault(); // Avoid zooming the browser window
			event.stopPropagation();

			const rotate = (this.data.flags?.[systemName] as MeasuredTemplateSystemFlags)?.rotate;
			if (rotate) {
				const delta = rotate;
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

	static _getCircleSquareShape(
		this: MeasuredTemplate,
		wrapper: (distance: number) => PIXI.Polygon,
		distance: number
	): PIXI.Polygon {
		if (this.data.t === 'circle') {
			const r = Ray.fromAngle(0, 0, 0, distance),
				dx = r.dx - r.dy,
				dy = r.dy + r.dx;

			const points = [dx, dy, dy, -dx, -dx, -dy, -dy, dx, dx, dy];
			return new PIXI.Polygon(points);
		}
		return wrapper(distance);
	}

	static _refreshRulerBurst(this: MeasuredTemplate, wrapper: () => void) {
		if (this.data.t === 'circle') {
			let d;
			let text;

			const closeBurst = (this.data.flags[systemName] as MeasuredTemplateSystemFlags)?.closeBurst ?? 'not-close';

			switch (closeBurst) {
				case 'not-close':
					d = Math.max(Math.round((this.data.distance - 0.5) * 10) / 10, 0);
					text = `Burst ${d}`;
					break;
				default:
					d = Math.max(Math.round((this.data.distance - sizeToTokenSize[closeBurst] / 2) * 10) / 10, 0);
					text = `Close Burst ${d} \n(${closeBurst})`;
					break;
			}

			if (this.hud.ruler) {
				this.hud.ruler.text = text;
				// this.hud.ruler.position.set(this.ray.dx + 10, this.ray.dy + 5);
			}
		} else {
			return wrapper();
		}
	}
}
