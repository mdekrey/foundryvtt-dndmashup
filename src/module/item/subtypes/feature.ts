import { SubItemFunctions } from './sub-item-functions';

export type FeatureType = 'feat' | 'class-feature' | 'race-feature' | 'paragon-feature' | 'epic-feature';

export const featureConfig: SubItemFunctions<'feature'> = {
	bonuses: (data) => [...data.data.grantedBonuses],
	prepare: () => {
		// nothing to prepare
	},
};
