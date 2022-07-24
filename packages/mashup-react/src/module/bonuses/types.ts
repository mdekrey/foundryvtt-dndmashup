import { BonusTarget, ConditionRule, ConditionRuleContext } from './constants';

export type FeatureBonus = {
	target: BonusTarget;
	amount: number | string;
	type?: string;
	condition: ConditionRule | null;
	disabled?: boolean;
};

export type FeatureBonusWithContext = FeatureBonus & {
	context: Partial<ConditionRuleContext>;
};
