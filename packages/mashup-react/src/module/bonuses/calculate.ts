import { groupBy } from 'lodash/fp';
import { BonusTarget, ConditionRuleContext } from './constants';
import { conditionsRegistry } from './registry';
import { FeatureBonusWithContext } from './types';

const sum = (v: number[]) => v.reduce((prev, next: number) => prev + next, 0);

export function byTarget(
	bonusesWithContext: FeatureBonusWithContext[]
): Record<BonusTarget, FeatureBonusWithContext[]> {
	return groupBy((e) => e.target, bonusesWithContext) as Record<BonusTarget, FeatureBonusWithContext[]>;
}

export function filterBonuses(bonusesWithContext: FeatureBonusWithContext[]) {
	return bonusesWithContext
		.filter(
			(bonus) => !bonus.condition || conditionsRegistry[bonus.condition].rule(bonus.context as ConditionRuleContext)
		)
		.filter((bonus) => !bonus.disabled);
}

export function sumFinalBonuses(finalBonuses: Record<string, number>): number {
	return sum(Object.values(finalBonuses));
}
