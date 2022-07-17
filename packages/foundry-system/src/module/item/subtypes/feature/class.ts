import { FeatureBonus } from '@foundryvtt-dndmashup/mashup-react';
import { FeatureDocument } from '@foundryvtt-dndmashup/mashup-react';
import { MashupItem } from '../../mashup-item';

export class MashupItemFeature extends MashupItem<'feature'> implements FeatureDocument {
	override allGrantedBonuses(): FeatureBonus[] {
		return this.data.data.grantedBonuses;
	}

	override canEmbedItem(): boolean {
		return false;
	}
}
