import { DynamicListEntry, FeatureBonus } from '@foundryvtt-dndmashup/mashup-rules';
import { PowerDocument } from '@foundryvtt-dndmashup/mashup-react';
import { MashupItem } from '../../mashup-item';
import { PossibleItemType } from '../../types';

export class MashupPower extends MashupItem<'power'> implements PowerDocument {
	override canEmbedItem(type: PossibleItemType): boolean {
		return type === 'power';
	}
	override allGrantedBonuses(): FeatureBonus[] {
		return [];
	}
	override allDynamicList(): DynamicListEntry[] {
		return [];
	}
}
