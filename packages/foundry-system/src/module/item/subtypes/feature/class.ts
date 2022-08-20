import {
	DynamicListEntryWithSource,
	FeatureBonusWithSource,
	SourcedPoolBonus,
	SourcedPoolLimits,
} from '@foundryvtt-dndmashup/mashup-rules';
import { FeatureDocument } from '@foundryvtt-dndmashup/mashup-react';
import { MashupItem } from '../../mashup-item';

export class MashupItemFeature extends MashupItem<'feature'> implements FeatureDocument {
	override allGrantedBonuses(): FeatureBonusWithSource[] {
		return this.data.data.grantedBonuses.map((b) => ({ ...b, source: this }));
	}
	override allDynamicList(): DynamicListEntryWithSource[] {
		return this.data.data.dynamicList.map((b) => ({ ...b, source: this }));
	}
	override allGrantedPools(): SourcedPoolLimits[] {
		return this.data.data.grantedPools ? this.data.data.grantedPools.map((b) => ({ ...b, source: [this] })) : [];
	}
	override allGrantedPoolBonuses(): SourcedPoolBonus[] {
		return this.data.data.grantedPoolBonuses
			? this.data.data.grantedPoolBonuses.map((b) => ({ ...b, source: this }))
			: [];
	}

	override canEmbedItem(): boolean {
		return false;
	}
}
