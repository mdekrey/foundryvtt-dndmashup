import { BoundsObject, getBounds } from './getBounds';

export function boundsIntersects(lhs: BoundsObject, rhs: BoundsObject) {
	const templateBounds = getBounds(lhs);
	if (!templateBounds) return false;

	const tokenBounds = getBounds(rhs);
	if (!tokenBounds) return false;

	return (templateBounds as any) /* FIXME: Foundry 10 types */
		.intersects(tokenBounds);
}
