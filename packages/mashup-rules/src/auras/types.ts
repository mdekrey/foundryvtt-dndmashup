import { FeatureBonus } from '../bonuses';
import { Source } from '../sources/types';

export type Aura = {
	range: number;
	bonuses: FeatureBonus[];
};

export type SourcedAura = Aura & {
	sources: Source[];
};
