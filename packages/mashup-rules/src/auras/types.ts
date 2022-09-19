import { FeatureBonus } from '../bonuses';
import { ConditionRuleContext, SimpleConditionRule } from '../conditions/types';
import { TriggeredEffect } from '../effects/types';
import { Source } from '../sources/types';
import { DispositionType } from './filterDisposition';

export type Aura = {
	// conditions and filters
	dispositionType: DispositionType | null;
	excludeSelf: boolean;
	range: number | string;
	condition: SimpleConditionRule;

	// effects
	bonuses: FeatureBonus[];
	triggeredEffects: TriggeredEffect[];
};

export type SourcedAura = Aura & {
	sources: Source[];
};

export type UnappliedAura = AuraEffect & Aura;

export type FullAura = AuraEffect &
	Aura & {
		range: number;
	};

export type AuraEffect = {
	bonuses: FeatureBonus[];
	triggeredEffects: TriggeredEffect[];
	sources: Source[];
	condition: SimpleConditionRule;
	context: ConditionRuleContext;
};
