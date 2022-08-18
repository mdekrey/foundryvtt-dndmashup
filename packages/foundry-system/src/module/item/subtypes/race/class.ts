import { DynamicListEntry, FeatureBonus, PoolBonus, PoolLimits } from '@foundryvtt-dndmashup/mashup-rules';
import { RaceDocument } from '@foundryvtt-dndmashup/mashup-react';
import { MashupItem } from '../../mashup-item';
import { PossibleItemType } from '../../types';

export class MashupItemRace extends MashupItem<'race'> implements RaceDocument {
	override canEmbedItem(type: PossibleItemType): boolean {
		return type === 'feature' || type === 'power';
	}
	override allGrantedBonuses(): FeatureBonus[] {
		return [
			{
				target: 'speed',
				amount: this.data.data.baseSpeed,
				type: 'racial',
				condition: null,
			},
			...this.data.data.grantedBonuses,
			...this.items.contents.flatMap((item) => item.allGrantedBonuses()),
		];
	}
	override allDynamicList(): DynamicListEntry[] {
		return [...this.data.data.dynamicList, ...this.items.contents.flatMap((item) => item.allDynamicList())];
	}
	override allGrantedPools(): PoolLimits[] {
		return this.items.contents.flatMap((item) => item.allGrantedPools());
	}
	override allGrantedPoolBonuses(): PoolBonus[] {
		return this.items.contents.flatMap((item) => item.allGrantedPoolBonuses());
	}
}
