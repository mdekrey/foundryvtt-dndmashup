import { FeatureBonus } from '../bonuses';
import { ConditionRuleContext, SimpleConditionRule } from '../conditions/types';
import { TriggeredEffect } from '../effects/types';
import { Source } from '../sources/types';
import { DispositionType } from './filterDisposition';

export type Aura = {
	dispositionType: DispositionType | null;
	excludeSelf: boolean;
	range: number;
	bonuses: FeatureBonus[];
	condition: SimpleConditionRule;
	triggeredEffects: TriggeredEffect[];
};

export type SourcedAura = Aura & {
	sources: Source[];
};

export type FullAura = AuraEffect & Aura;

export type AuraEffect = {
	bonuses: FeatureBonus[];
	triggeredEffects: TriggeredEffect[];
	sources: Source[];
	condition: SimpleConditionRule;
	context: Partial<ConditionRuleContext>;
};
