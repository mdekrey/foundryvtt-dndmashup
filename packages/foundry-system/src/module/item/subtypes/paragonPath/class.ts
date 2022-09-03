import {
	SourcedAura,
	DynamicListEntryWithSource,
	FeatureBonusWithSource,
	SourcedPoolBonus,
	SourcedPoolLimits,
} from '@foundryvtt-dndmashup/mashup-rules';
import { ParagonPathDocument } from '@foundryvtt-dndmashup/mashup-react';
import { MashupItem } from '../../mashup-item';
import { PossibleItemType } from '../../types';

export class MashupParagonPath extends MashupItem<'paragonPath'> implements ParagonPathDocument {
	override canEmbedItem(type: PossibleItemType): boolean {
		return type === 'feature';
	}
	override allGrantedBonuses(): FeatureBonusWithSource[] {
		return this.items.contents.flatMap((item) => item.allGrantedBonuses());
	}
	override allDynamicList(): DynamicListEntryWithSource[] {
		return this.items.contents.flatMap((item) => item.allDynamicList());
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
}
