import { ConditionRule, ConditionRuleContext, ConditionRuleType } from './constants';
import { ConditionRuleRegistryEntry, conditionsRegistry } from './registry';

export function getRuleText<TType extends ConditionRuleType>(
	rule: ConditionRule<TType>,
	runtime?: Partial<ConditionRulesRuntimeParameters>
) {
	const registryEntry: ConditionRuleRegistryEntry<TType> = conditionsRegistry[rule.rule];
	return registryEntry.ruleText(rule.parameter, runtime);
}

export function isRuleApplicable<TType extends ConditionRuleType>(
	rule: ConditionRule<TType>,
	context: Partial<ConditionRuleContext>,
	runtime?: Partial<ConditionRulesRuntimeParameters>
) {
	const registryEntry: ConditionRuleRegistryEntry<TType> = conditionsRegistry[rule.rule];
	return registryEntry.rule(context as ConditionRuleContext, rule.parameter, runtime ?? {});
}
