import { ensureSign } from '@foundryvtt-dndmashup/core';
import { ConditionRuleContext, getRuleText } from '../conditions';
import { numericBonusTargetNames } from './bonus-sheet-utils';
import { FeatureBonus } from './types';

export function bonusToText(bonus: FeatureBonus & { context?: ConditionRuleContext }) {
	const conditionText = bonus.condition ? getRuleText(bonus.condition, bonus.context) : null;
	return `${ensureSign(bonus.amount)} ${bonus.type ?? ''} bonus to ${numericBonusTargetNames[bonus.target].ruleText} ${
		conditionText ? `${conditionText}` : ''
	}`.trim();
}
