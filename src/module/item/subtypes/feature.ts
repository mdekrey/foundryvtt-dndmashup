import { FeatureBonus } from 'src/module/bonuses';
import { MashupItemBase } from '../mashup-item-base';

export type FeatureType = 'feat' | 'class-feature' | 'race-feature' | 'paragon-feature' | 'epic-feature';

export class MashupItemFeature extends MashupItemBase<'feature'> {
	override allGrantedBonuses(): FeatureBonus[] {
		return [...this.data.data.grantedBonuses];
	}
}
