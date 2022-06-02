import { FeatureBonus } from 'src/module/bonuses';
import { MashupItem } from '../mashup-item';

export type FeatureType = 'feat' | 'class-feature' | 'race-feature' | 'paragon-feature' | 'epic-feature';

export class MashupItemFeature extends MashupItem<'feature'> {
	override allGrantedBonuses(): FeatureBonus[] {
		return [...this.data.data.grantedBonuses];
	}
}
