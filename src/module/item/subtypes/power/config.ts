import { FeatureBonus } from 'src/module/bonuses';
import { MashupItem } from '../../mashup-item';
import { PossibleItemType } from '../../types';

export class MashupPower extends MashupItem<'power'> {
	override canEmbedItem(type: PossibleItemType): boolean {
		return type === 'power';
	}
	override allGrantedBonuses(): FeatureBonus[] {
		return [];
	}
}
