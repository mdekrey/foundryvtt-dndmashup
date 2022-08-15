import { NumericBonusTarget, ConditionRule, ConditionRuleContext } from './constants';

export type SimpleConditionRule = Exclude<ConditionRule, ConditionRule<''>> | null;

export type FeatureBonus = {
	target: NumericBonusTarget;
	amount: number | string;
	type?: string;
	condition: SimpleConditionRule;
	disabled?: boolean;
};

export type FeatureBonusWithContext = FeatureBonus & {
	context: Partial<ConditionRuleContext>;
};
export const untypedBonus = Symbol('untyped');
export type BonusByType = {
	[untypedBonus]?: string;
	[k: string]: number;
};
