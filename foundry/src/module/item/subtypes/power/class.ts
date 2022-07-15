import { FeatureBonus } from 'dndmashup-react/src/module/bonuses';
import { PowerDocument } from 'dndmashup-react/src/module/item/subtypes/power/dataSourceData';
import { MashupItem } from '../../mashup-item';
import { PossibleItemType } from '../../types';

export class MashupPower extends MashupItem<'power'> implements PowerDocument {
	override canEmbedItem(type: PossibleItemType): boolean {
		return type === 'power';
	}
	override allGrantedBonuses(): FeatureBonus[] {
		return [];
	}
}
