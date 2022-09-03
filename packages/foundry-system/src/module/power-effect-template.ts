import { Size, sizeToTokenSize } from '@foundryvtt-dndmashup/mashup-rules';
import { EffectTypeAndRange } from '@foundryvtt-dndmashup/mashup-react';
import { MeasuredTemplateDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/measuredTemplateData';
import { isGame } from '../core/foundry';
import { systemName } from './constants';
import { neverEver } from '@foundryvtt-dndmashup/core';

type MeasuredTemplateFactory<T extends EffectTypeAndRange['type'] = EffectTypeAndRange['type']> = {
	create: (typeAndRange: EffectTypeAndRange & { type: T }, size: Size) => MeasuredTemplateDataConstructorData | null;
};

type MeasuredTemplateSystemFlags = {
	rotate?: number;
	closeBurst?: Size;
	text?: string;
};

const byEffectType: { [K in EffectTypeAndRange['type']]?: MeasuredTemplateFactory<K> } = {
	close: {
		create(effect, actorSize) {
			return effect.shape === 'blast'
				? {
						t: 'rect',
						// distance + direction is the angle of the rectangle
						distance: effect.size,
						direction: 0,
						flags: {
							[systemName]: { rotate: 90, closeBurst: undefined, text: `Close Blast ${effect.size.toFixed(0)}` },
						},
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
	static onCancel: undefined | (() => void);

	static canCreate(typeAndRange: EffectTypeAndRange) {
		return (byEffectType[typeAndRange.type] as MeasuredTemplateFactory | undefined)?.create(typeAndRange, 'medium')
			? true
			: false;
	}

	static fromTypeAndRange(typeAndRange: EffectTypeAndRange, actorSize: Size) {
		const user = (isGame(game) && game.user) || null;

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

		return new this(template);
	}

	drawPreview(cleanup?: () => void) {
		PowerEffectTemplate.onCancel?.();

		const initialLayer = canvas?.activeLayer;
		if (!initialLayer) return;
		this.layer.activate();
		this.draw();
		const previewLayer = this.layer.preview;
		if (!previewLayer) return;
		previewLayer.addChild(this);
		this.activatePreviewListeners(() => {
			previewLayer.removeChild(this);
			initialLayer.activate();
			cleanup?.();
		});
	}

	activatePreviewListeners(cleanup?: () => void) {
		const handlers: {
			mouseMove?: (event: MouseEvent) => void;
			mouseWheel?: (event: WheelEvent) => void;
			leftClick?: (event: MouseEvent) => void;
			rightClick?: () => void;
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
		handlers.rightClick = () => {
			PowerEffectTemplate.onCancel = undefined;
			this.destroy();
			stage.off('mousemove', handlers.mouseMove);
			stage.off('mousedown', handlers.leftClick);
			app.view.oncontextmenu = null;
			app.view.onwheel = null;
			cleanup?.();
		};

		// Confirm the workflow (left-click)
		handlers.leftClick = (event) => {
			handlers.rightClick?.();
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
		PowerEffectTemplate.onCancel = handlers.rightClick;
	}

	static getSquareShape(distance: number) {
		const r = Ray.fromAngle(0, 0, 0, distance),
			dx = r.dx - r.dy,
			dy = r.dy + r.dx;

		const points = [dx, dy, dy, -dx, -dx, -dy, -dy, dx, dx, dy];
		return new PIXI.Polygon(points);
	}

	static _getCircleSquareShape(
		this: MeasuredTemplate,
		wrapper: (distance: number) => PIXI.Polygon,
		distance: number
	): PIXI.Polygon {
		if (this.data.t === 'circle') {
			return PowerEffectTemplate.getSquareShape(distance);
		}
		return wrapper(distance);
	}

	protected override _getRectShape(direction: number, distance: number): NormalizedRectangle {
		if (direction < (1 * Math.PI) / 2) return new NormalizedRectangle(0, 0, distance, distance);
		if (direction < (2 * Math.PI) / 2) return new NormalizedRectangle(-distance, 0, distance, distance);
		if (direction < (3 * Math.PI) / 2) return new NormalizedRectangle(-distance, -distance, distance, distance);
		return new NormalizedRectangle(0, -distance, distance, distance);
	}

	override refresh(): this {
		if (!this.template || !this.hud.icon) return this;
		// Should be basically identical to the original target, but doesn't draw the ray.
		this.position.set(this.data.x, this.data.y);

		// Get the Template shape
		this.shape = this.getBaseShape();

		// Draw the Template outline
		this.template
			.clear()
			.lineStyle(this._borderThickness, this.borderColor as number, 0.75)
			.beginFill(0x000000, 0.0);

		// Fill Color or Texture
		if (this.texture)
			this.template.beginTextureFill({
				texture: this.texture,
			});
		else this.template.beginFill(0x000000, 0.0);

		// Draw the shape
		this.template.drawShape(this.shape);

		// Draw origin and destination points
		this.template.lineStyle(this._borderThickness, 0x000000).beginFill(0x000000, 0.5).drawCircle(0, 0, 6);

		// Update the HUD
		this.hud.icon.visible = this.layer._active;
		this.hud.icon.border.visible = this._hover;
		this._refreshRulerText.call(this);
		return this;
	}

	getBaseShape(): PIXI.Polygon | PIXI.Circle | PIXI.Ellipse | PIXI.Rectangle | PIXI.RoundedRectangle {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const d = canvas!.dimensions!;
		const { angle } = this.data;
		let { direction, distance, width } = this.data;
		distance *= d.size / d.distance;
		width *= d.size / d.distance;
		direction = Math.toRadians(direction);

		(this as any).ray = Ray.fromAngle(this.data.x, this.data.y, direction, distance);

		switch (this.data.t) {
			case 'circle':
				return PowerEffectTemplate.getSquareShape(distance);
			case 'cone':
				return this._getConeShape(direction, angle, distance);
			case 'rect':
				return this._getRectShape(direction, distance);
			case 'ray':
				return this._getRayShape(direction, distance, width);
			default:
				return neverEver(this.data.t);
		}
	}

	getBoundingBox(): PIXI.Rectangle {
		const shape = this.getBaseShape();

		if (shape instanceof PIXI.Polygon) {
			let xMin = shape.points[0],
				xMax = shape.points[0],
				yMin = shape.points[1],
				yMax = shape.points[1];
			shape.points.forEach((p, index) => {
				if (index % 2 === 0) {
					xMin = Math.min(xMin, p);
					xMax = Math.max(xMax, p);
				} else {
					yMin = Math.min(yMin, p);
					yMax = Math.max(yMax, p);
				}
			});
			return new PIXI.Rectangle(xMin, yMin, xMax - xMin, yMax - yMin);
		} else if ('getBounds' in shape) {
			return shape.getBounds();
		} else if (shape instanceof PIXI.RoundedRectangle) {
			return new PIXI.Rectangle(shape.x, shape.y, shape.width, shape.height);
		} else {
			return shape;
		}
	}

	protected override _refreshRulerText(): void {
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
		} else if ((this.data.flags[systemName] as MeasuredTemplateSystemFlags)?.text) {
			if (this.hud.ruler) {
				this.hud.ruler.text = (this.data.flags[systemName] as MeasuredTemplateSystemFlags)?.text as string;
			}
		} else {
			return super._refreshRulerText();
		}
	}
}
