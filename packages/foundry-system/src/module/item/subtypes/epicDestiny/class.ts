import { FeatureBonus } from 'dndmashup-react/src/module/bonuses';
import { EpicDestinyDocument } from 'dndmashup-react/src/module/item/subtypes/epicDestiny/dataSourceData';
import { MashupItem } from '../../mashup-item';
import { PossibleItemType } from '../../types';

export class MashupEpicDestiny extends MashupItem<'epicDestiny'> implements EpicDestinyDocument {
	override canEmbedItem(type: PossibleItemType): boolean {
		return type === 'feature';
	}
	override allGrantedBonuses(): FeatureBonus[] {
		return this.items.contents.flatMap((item) => item.allGrantedBonuses());
	}
}
