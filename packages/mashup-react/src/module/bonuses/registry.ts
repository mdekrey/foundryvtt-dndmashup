import { Stateful } from '@foundryvtt-dndmashup/mashup-core';
import { ConditionRuleContext, ConditionRuleIndeterminateResult } from './constants';

declare global {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface ConditionRules {
		'': never;
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface ConditionRulesRuntimeParameters {}
}

export type ConditionRuleRegistryEntry<TType extends keyof ConditionRules> = {
	ruleText: (parameter?: ConditionRules[TType], runtime?: Partial<ConditionRulesRuntimeParameters>) => string;
	ruleEditor: React.FC<Stateful<ConditionRules[TType] | undefined>>;
	rule(
		input: ConditionRuleContext,
		parameter: ConditionRules[TType],
		runtime: Partial<ConditionRulesRuntimeParameters>
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
