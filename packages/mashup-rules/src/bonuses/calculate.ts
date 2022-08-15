import { groupBy } from 'lodash/fp';
import { isRuleApplicable, SimpleConditionRule } from '../conditions';

const sum = (v: number[]) => v.reduce((prev, next: number) => prev + next, 0);

export function byTarget<TType extends string, TEntry extends { target: TType }>(
	bonusesWithContext: TEntry[]
): Record<TType, TEntry[]> {
	return groupBy((e) => e.target, bonusesWithContext) as Record<TType, TEntry[]>;
}

export function filterConditions<
	T extends { condition: SimpleConditionRule; disabled?: boolean; context: Partial<ConditionGrantingContext> }
>(bonusesWithContext: T[], runtimeParameters: Partial<ConditionRulesRuntimeParameters>, includeIndeterminate: boolean) {
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
