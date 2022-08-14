import { groupBy } from 'lodash/fp';
import { NumericBonusTarget, ConditionRuleContext } from './constants';
import { conditionsRegistry } from './registry';
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
			const rule = bonus.condition?.rule ?? '';
			const result = conditionsRegistry[rule].rule(
				bonus.context as ConditionRuleContext,
				bonus.condition?.parameter as never,
				runtimeParameters
			);
			return [bonus, result] as const;
		})
		.filter(([, result]) => {
			return includeIndeterminate ? result !== false : result === true;
		});
}

export function sumFinalBonuses(finalBonuses: Record<string, number>): number {
	return sum(Object.values(finalBonuses));
}
