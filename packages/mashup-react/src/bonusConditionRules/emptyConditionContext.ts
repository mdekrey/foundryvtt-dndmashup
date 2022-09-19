import { ConditionRuleContext, ConditionRulesRuntimeParameters } from '@foundryvtt-dndmashup/mashup-rules';

export const emptyConditionContext: ConditionRuleContext = {
	actor: undefined,
	item: undefined,
	activeEffectSources: undefined,
};

export const emptyConditionRuntime: ConditionRulesRuntimeParameters = {
	power: undefined,
	targets: undefined,
};
