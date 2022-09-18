import { ConditionRuleContext, SimpleConditionRule } from '../conditions';
import { Source } from '../sources/types';
import { NumericBonusTarget } from './constants';

export type FeatureBonus = {
	target: NumericBonusTarget;
	amount: number | string;
	type?: string;
	condition: SimpleConditionRule;
	disabled?: boolean;
};

export type FeatureBonusWithSource = FeatureBonus & {
	source: Source;
};

export type FeatureBonusWithContext = FeatureBonus & {
	context: Partial<ConditionRuleContext>;
};
export type FullFeatureBonus = FeatureBonusWithSource & FeatureBonusWithContext;
export type BonusByType = {
	[K in string]: K extends '' ? string | number : number;
};
