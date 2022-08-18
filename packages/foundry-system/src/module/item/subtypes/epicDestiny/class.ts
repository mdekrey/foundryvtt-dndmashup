import { DynamicListEntry, FeatureBonus, PoolBonus, PoolLimits } from '@foundryvtt-dndmashup/mashup-rules';
import { EpicDestinyDocument } from '@foundryvtt-dndmashup/mashup-react';
import { MashupItem } from '../../mashup-item';
import { PossibleItemType } from '../../types';

export class MashupEpicDestiny extends MashupItem<'epicDestiny'> implements EpicDestinyDocument {
	override canEmbedItem(type: PossibleItemType): boolean {
		return type === 'feature';
	}
	override allGrantedBonuses(): FeatureBonus[] {
		return this.items.contents.flatMap((item) => item.allGrantedBonuses());
	}
	override allDynamicList(): DynamicListEntry[] {
		return this.items.contents.flatMap((item) => item.allDynamicList());
	}
	override allGrantedPools(): PoolLimits[] {
		return this.items.contents.flatMap((item) => item.allGrantedPools());
	}
	override allGrantedPoolBonuses(): PoolBonus[] {
		return this.items.contents.flatMap((item) => item.allGrantedPoolBonuses());
	}
}
