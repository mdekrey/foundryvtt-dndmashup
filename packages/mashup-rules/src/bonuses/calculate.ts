import { groupBy } from 'lodash/fp';
import { isRuleApplicable } from '../conditions';
import { NumericBonusTarget } from './constants';
import { FeatureBonusWithContext } from './types';

const sum = (v: number[]) => v.reduce((prev, next: number) => prev + next, 0);

export function byTarget(
	bonusesWithContext: FeatureBonusWithContext[]
): Record<NumericBonusTarget, FeatureBonusWithContext[]> {
	return groupBy((e) => e.target, bonusesWithContext) as Record<NumericBonusTarget, FeatureBonusWithContext[]>;
}

export function filterBonuses(
	bonusesWithContext: FeatureBonusWithContext[],
	runtimeParameters: Partial<ConditionRulesRuntimeParameters>,
	includeIndeterminate: boolean
) {
	return bonusesWithContext
		.filter((bonus) => !bonus.disabled)
		.map((bonus) => {
			const result = !bonus.condition || isRuleApplicable(bonus.condition, bonus.context, runtimeParameters);
			return [bonus, result] as const;
		})
		.filter(([, result]) => {
			return includeIndeterminate ? result !== false : result === true;
		});
}

export function sumFinalBonuses(finalBonuses: Record<string, number>): number {
	return sum(Object.values(finalBonuses));
}
