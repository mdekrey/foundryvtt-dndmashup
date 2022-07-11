import { FeatureBonus } from 'src/module/bonuses';
import { MashupItem } from '../../mashup-item';
import { PossibleItemType } from '../../types';

export class MashupParagonPath extends MashupItem<'paragonPath'> {
	override canEmbedItem(type: PossibleItemType): boolean {
		return type === 'feature';
	}
	override allGrantedBonuses(): FeatureBonus[] {
		return this.items.contents.flatMap((item) => item.allGrantedBonuses());
	}
}
