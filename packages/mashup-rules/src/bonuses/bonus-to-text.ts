import { ensureSign } from '@foundryvtt-dndmashup/core';
import { getRuleText } from '../conditions';
import { numericBonusTargetNames } from './bonus-sheet-utils';
import { FeatureBonus } from './types';

export function bonusToText(bonus: FeatureBonus) {
	const conditionText = bonus.condition ? getRuleText(bonus.condition) : null;
	return `${ensureSign(bonus.amount)} ${bonus.type ?? ''} bonus to ${numericBonusTargetNames[bonus.target].ruleText} ${
		conditionText ? `when ${conditionText}` : ''
	}`.trim();
}
