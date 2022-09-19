import { Stateful } from '@foundryvtt-dndmashup/core';
import { ConditionRuleContext, ConditionRuleIndeterminateResult, ConditionRulesRuntimeParameters } from './types';

declare global {
	interface ConditionRules {
		'': never;
	}
}

export type ConditionRuleRegistryEntry<TType extends keyof ConditionRules> = {
	ruleText: (parameter?: ConditionRules[TType], runtime?: ConditionRulesRuntimeParameters) => string;
	ruleEditor: React.FC<Stateful<ConditionRules[TType] | undefined>>;
	rule(
		input: ConditionRuleContext,
		parameter: ConditionRules[TType],
		runtime: ConditionRulesRuntimeParameters
	): boolean | ConditionRuleIndeterminateResult;
};

const unconditional: ConditionRuleRegistryEntry<''> = {
	ruleText: () => `(always)`,
	ruleEditor: () => null,
	rule: () => true,
};

export const conditionsRegistry: { [K in keyof ConditionRules]: ConditionRuleRegistryEntry<K> } = {
	'': unconditional,
} as never;
