import { FeatureBonus } from 'src/module/bonuses';
import { MashupItemBase } from '../mashup-item-base';
import { SubItemFunctions } from './sub-item-functions';

export type FeatureType = 'feat' | 'class-feature' | 'race-feature' | 'paragon-feature' | 'epic-feature';

export const featureConfig: SubItemFunctions<'feature'> = {
	bonuses: (data) => [...data.data.grantedBonuses],
	prepare: () => {
		// nothing to prepare
	},
};

export class MashupItemFeature extends MashupItemBase<'feature'> {
	override allGrantedBonuses(): FeatureBonus[] {
		return [...this.data.data.grantedBonuses];
	}
}
