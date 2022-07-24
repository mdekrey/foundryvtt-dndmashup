import { ConditionRuleType, ConditionRuleFunction } from './constants';

declare global {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface ConditionRules {}
}

export const conditionsRegistry: Record<ConditionRuleType, ConditionRuleFunction> = {} as never;
