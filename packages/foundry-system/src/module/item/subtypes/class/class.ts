import {
	DynamicListEntryWithSource,
	FeatureBonusWithSource,
	SourcedAura,
	SourcedPoolBonus,
	SourcedPoolLimits,
	SourcedTriggeredEffect,
} from '@foundryvtt-dndmashup/mashup-rules';
import { ClassDocument } from '@foundryvtt-dndmashup/mashup-react';
import { MashupItem } from '../../mashup-item';
import { PossibleItemType } from '../../types';

export class MashupItemClass extends MashupItem<'class'> implements ClassDocument {
	override canEmbedItem(type: PossibleItemType): boolean {
		return type === 'feature' || type === 'power';
	}
	override allGrantedBonuses(): FeatureBonusWithSource[] {
		return [
			{
				target: 'maxHp',
				amount: `${this.system.hpBase} + ${this.system.hpPerLevel} * @actor.extraLevels`,
				type: 'class',
				condition: null,
				source: this,
			},
			{
				target: 'surges-max',
				amount: this.system.healingSurgesBase,
				type: 'class',
				condition: null,
				source: this,
			},
			...this.system.grantedBonuses.map((b) => ({ ...b, source: this })),
			...this.items.contents.flatMap((item) => item.allGrantedBonuses()),
		];
	}
	override allDynamicList(): DynamicListEntryWithSource[] {
		return [
			...this.system.dynamicList.map((b) => ({ ...b, source: this })),
			...this.items.contents.flatMap((item) => item.allDynamicList()),
		];
	}
	override allGrantedPools(): SourcedPoolLimits[] {
		return this.items.contents.flatMap((item) => item.allGrantedPools());
	}
	override allGrantedPoolBonuses(): SourcedPoolBonus[] {
		return this.items.contents.flatMap((item) => item.allGrantedPoolBonuses());
	}
	override allGrantedAuras(): SourcedAura[] {
		return this.items.contents.flatMap((item) => item.allGrantedAuras());
	}
	override allTriggeredEffects(): SourcedTriggeredEffect[] {
		return this.items.contents.flatMap((item) => item.allTriggeredEffects());
	}
}
