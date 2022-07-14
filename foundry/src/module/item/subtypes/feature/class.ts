import { FeatureBonus } from 'dndmashup-react/module/bonuses';
import { MashupItem } from '../../mashup-item';

export class MashupItemFeature extends MashupItem<'feature'> {
	override allGrantedBonuses(): FeatureBonus[] {
		return this.data.data.grantedBonuses;
	}

	override canEmbedItem(): boolean {
		return false;
	}
}
