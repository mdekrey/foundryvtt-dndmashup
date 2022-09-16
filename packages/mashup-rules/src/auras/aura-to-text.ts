import { neverEver } from '@foundryvtt-dndmashup/core';
import { bonusToText } from '../bonuses';
import { getRuleText } from '../conditions';
import { getTriggeredEffectText } from '../effects';
import { DispositionType } from './filterDisposition';
import { Aura } from './types';

function dispositionTypeToText(dispositionType: DispositionType | null) {
	if (dispositionType === null) return 'all creatures';
	switch (dispositionType) {
		case 'ally':
			return 'all allies';
		case 'enemy':
			return 'all enemies';
		case 'not allies':
			return 'all creatures except allies';
		case 'not enemies':
			return 'all creatures except enemies';
		case 'hostile':
			return 'all creatures hostile to the PCs';
		case 'friendly':
			return 'all creatures friendly to the PCs';
		default:
			return neverEver(dispositionType);
	}
}

export function auraToText(aura: Aura) {
	const selfExclusionText = aura.excludeSelf ? '' : 'you and';
	const dispositionText = dispositionTypeToText(aura.dispositionType);
	const rangeText = `within ${aura.range} squares of you`;
	const descriptive = 'gain the following effects';
	const conditionText = aura.condition ? getRuleText(aura.condition) : null;
	const introSentence = `${[selfExclusionText, dispositionText, rangeText, descriptive, conditionText].join(' ')}:`;
	return [introSentence, ...aura.bonuses.map(bonusToText), ...aura.triggeredEffects.map(getTriggeredEffectText)].join(
		' '
	);
}
