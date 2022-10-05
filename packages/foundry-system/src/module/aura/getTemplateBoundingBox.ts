import { PowerEffectTemplate } from './power-effect-template';

export function getTemplateBoundingBox(template: MeasuredTemplateDocument) {
	if (!(template.object instanceof PowerEffectTemplate)) return null;

	const shape = template.object.getBaseShape();
	const templateObjectBounds = getShapeBounds();
	return new PIXI.Rectangle(
		templateObjectBounds.x + template.data.x,
		templateObjectBounds.y + template.data.y,
		templateObjectBounds.width,
		templateObjectBounds.height
	);

	function getShapeBounds() {
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
}
