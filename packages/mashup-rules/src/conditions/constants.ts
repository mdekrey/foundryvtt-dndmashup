declare global {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface ConditionGrantingContext {}
}

export type ConditionRuleType = keyof ConditionRules;
export type ConditionRule<TType extends ConditionRuleType = ConditionRuleType> = {
	[K in TType]: {
		rule: K;
		parameter: ConditionRules[K];
	};
}[TType];
export type ConditionRuleContext = ConditionGrantingContext;

export const ruleResultIndeterminate = Symbol('indeterminate');
export type ConditionRuleIndeterminateResult = typeof ruleResultIndeterminate;

export type SimpleConditionRule = Exclude<ConditionRule, ConditionRule<''>> | null;
