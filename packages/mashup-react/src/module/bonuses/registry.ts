import { ConditionRule, ConditionRuleFunction } from './constants';

declare global {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface ConditionRules {}
}

export const conditionsRegistry: Record<ConditionRule, ConditionRuleFunction> = {
	'': { label: '(always)', display: '', target: () => true },
} as never;
