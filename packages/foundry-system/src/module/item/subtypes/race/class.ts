import {
	SourcedAura,
	DynamicListEntryWithSource,
	FeatureBonusWithSource,
	SourcedPoolBonus,
	SourcedPoolLimits,
	SourcedTriggeredEffect,
} from '@foundryvtt-dndmashup/mashup-rules';
import { RaceDocument } from '@foundryvtt-dndmashup/mashup-react';
import { MashupItem } from '../../mashup-item';
import { PossibleItemType } from '../../types';

export class MashupItemRace extends MashupItem<'race'> implements RaceDocument {
	override canEmbedItem(type: PossibleItemType): boolean {
		return type === 'feature' || type === 'power';
	}
	override allGrantedBonuses(): FeatureBonusWithSource[] {
		return [
			{
				target: 'speed',
				amount: this.system.baseSpeed,
				type: 'racial',
				source: this,
				condition: null,
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
