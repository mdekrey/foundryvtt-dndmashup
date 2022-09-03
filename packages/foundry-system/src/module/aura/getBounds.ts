import { neverEver } from '@foundryvtt-dndmashup/core';
import { getTemplateBoundingBox } from './getTemplateBoundingBox';
import { getTokenBounds } from './getTokenBounds';

export type Aura = {
	token: TokenDocument;
	auraSize: number;
};

export type BoundsObject = MeasuredTemplateDocument | TokenDocument | Aura;

export function getBounds(target: BoundsObject) {
	if (target instanceof MeasuredTemplateDocument) {
		return getTemplateBoundingBox(target);
	} else if (target instanceof TokenDocument) {
		return getTokenBounds(target, 0);
	} else if ('auraSize' in target) {
		return getTokenBounds(target.token, target.auraSize);
	} else {
		return neverEver(target);
	}
}
