import { FeatureBonus } from 'dndmashup-react/src/module/bonuses';
import { FeatureDocument } from 'dndmashup-react/src/module/item/subtypes/feature/dataSourceData';
import { MashupItem } from '../../mashup-item';

export class MashupItemFeature extends MashupItem<'feature'> implements FeatureDocument {
	override allGrantedBonuses(): FeatureBonus[] {
		return this.data.data.grantedBonuses;
	}

	override canEmbedItem(): boolean {
		return false;
	}
}
