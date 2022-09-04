import {
	DynamicListEntryWithSource,
	FeatureBonusWithSource,
	SourcedAura,
	SourcedPoolBonus,
	SourcedPoolLimits,
} from '@foundryvtt-dndmashup/mashup-rules';
import { FeatureDocument, PossibleItemType } from '@foundryvtt-dndmashup/mashup-react';
import { MashupItem } from '../../mashup-item';

export class MashupItemFeature extends MashupItem<'feature'> implements FeatureDocument {
	override allGrantedBonuses(): FeatureBonusWithSource[] {
		return [
			...this.items.contents.flatMap((item) => item.allGrantedBonuses()),
			...this.data.data.grantedBonuses.map((b) => ({ ...b, source: this })),
		];
	}
	override allDynamicList(): DynamicListEntryWithSource[] {
		return [
			...this.items.contents.flatMap((item) => item.allDynamicList()),
			...this.data.data.dynamicList.map((b) => ({ ...b, source: this })),
		];
	}
	override allGrantedPools(): SourcedPoolLimits[] {
		return [
			...this.items.contents.flatMap((item) => item.allGrantedPools()),
			...(this.data.data.grantedPools?.map((b) => ({ ...b, source: [this] })) ?? []),
		];
	}
	override allGrantedPoolBonuses(): SourcedPoolBonus[] {
		return [
			...this.items.contents.flatMap((item) => item.allGrantedPoolBonuses()),
			...(this.data.data.grantedPoolBonuses?.map((b) => ({ ...b, source: this })) ?? []),
		];
	}

	override canEmbedItem(type: PossibleItemType): boolean {
		return type === 'feature' || type === 'power';
	}
	override allGrantedAuras(): SourcedAura[] {
		return [
			...this.items.contents.flatMap((item) => item.allGrantedAuras()),
			...(this.data.data.grantedAuras?.map((b) => ({ ...b, sources: [this] })) ?? []),
		];
	}
}
