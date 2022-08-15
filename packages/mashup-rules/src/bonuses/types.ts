import { ConditionRuleContext, SimpleConditionRule } from '../conditions';
import { NumericBonusTarget } from './constants';

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
