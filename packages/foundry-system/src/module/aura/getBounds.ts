import { neverEver } from '@foundryvtt-dndmashup/core';
import { MashupTokenDocument } from '../token/mashup-token-document';
import { getTemplateBoundingBox } from './getTemplateBoundingBox';
import { getTokenBounds } from './getTokenBounds';

export type Aura = {
	token: MashupTokenDocument;
	auraSize: number;
};

export type BoundsObject = MeasuredTemplateDocument | MashupTokenDocument | Aura;

export function getBounds(target: BoundsObject) {
	if (target instanceof MeasuredTemplateDocument) {
		return getTemplateBoundingBox(target);
	} else if (target instanceof MashupTokenDocument) {
		return getTokenBounds(target, 0);
	} else if ('auraSize' in target) {
		return getTokenBounds(target.token, target.auraSize);
	} else {
		return neverEver(target);
	}
}
