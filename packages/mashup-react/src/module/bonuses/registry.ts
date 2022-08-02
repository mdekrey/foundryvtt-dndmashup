import { ConditionRuleContext, ConditionRuleIndeterminateResult, ConditionRuleType } from './constants';

declare global {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface ConditionRules {}

	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface ConditionRulesRuntimeParameters {}
}

export type ConditionRuleRegistryEntry<TType extends ConditionRuleType> = {
	ruleText: (parameter?: ConditionRules[TType], runtime?: Partial<ConditionRulesRuntimeParameters>) => string;
	rule(
		input: ConditionRuleContext,
		parameter: ConditionRules[TType],
		runtime: Partial<ConditionRulesRuntimeParameters>
	): boolean | ConditionRuleIndeterminateResult;
};

export const conditionsRegistry: { [K in ConditionRuleType]: ConditionRuleRegistryEntry<K> } = {} as never;
