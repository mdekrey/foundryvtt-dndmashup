import { ConditionRuleContext, SimpleConditionRule } from '../conditions';
import { NumericBonusTarget } from './constants';

export type FeatureBonus = {
	target: NumericBonusTarget;
	amount: number | string;
	type?: string;
	condition: SimpleConditionRule;
	disabled?: boolean;
};

export type FeatureBonusWithSource = FeatureBonus & {
	source: { id: string | null; name: string | null; img: string | null; showEditDialog(): void };
};

export type FeatureBonusWithContext = FeatureBonus & {
	context: Partial<ConditionRuleContext>;
};
export type FullFeatureBonus = FeatureBonusWithSource & FeatureBonusWithContext;
export type BonusByType = {
	[k: string]: number;
};
