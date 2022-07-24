import { groupBy } from 'lodash/fp';
import { BonusTarget, ConditionRuleContext, ConditionRuleType } from './constants';
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
		.filter((bonus) => {
			const rule =
				typeof bonus.condition === 'string'
					? bonus.condition === ''
						? null
						: (bonus.condition as ConditionRuleType)
					: bonus.condition?.rule;
			return !rule || conditionsRegistry[rule].rule(bonus.context as ConditionRuleContext);
		})
		.filter((bonus) => !bonus.disabled);
}

export function sumFinalBonuses(finalBonuses: Record<string, number>): number {
	return sum(Object.values(finalBonuses));
}
