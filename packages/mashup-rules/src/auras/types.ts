import { FeatureBonus } from '../bonuses';
import { ConditionRuleContext } from '../conditions/types';
import { TriggeredEffect } from '../effects/types';
import { Source } from '../sources/types';

export type Aura = {
	range: number;
	bonuses: FeatureBonus[];
	triggeredEffects: TriggeredEffect[];
};

export type SourcedAura = Aura & {
	sources: Source[];
};

export type FullAura = SourcedAura & {
	context: Partial<ConditionRuleContext>;
};
