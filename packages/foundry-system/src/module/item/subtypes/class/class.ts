import { DynamicListEntry, FeatureBonus, PoolBonus, PoolLimits } from '@foundryvtt-dndmashup/mashup-rules';
import { ClassDocument } from '@foundryvtt-dndmashup/mashup-react';
import { MashupItem } from '../../mashup-item';
import { PossibleItemType } from '../../types';

export class MashupItemClass extends MashupItem<'class'> implements ClassDocument {
	override canEmbedItem(type: PossibleItemType): boolean {
		return type === 'feature' || type === 'power';
	}
	override allGrantedBonuses(): FeatureBonus[] {
		return [
			{
				target: 'maxHp',
				amount: `${this.data.data.hpBase} + ${this.data.data.hpPerLevel} * @actor.extraLevels`,
				type: 'class',
				condition: null,
			},
			{
				target: 'surges-max',
				amount: this.data.data.healingSurgesBase,
				type: 'class',
				condition: null,
			},
			...this.data.data.grantedBonuses,
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
