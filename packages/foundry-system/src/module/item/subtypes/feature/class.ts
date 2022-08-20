import {
	DynamicListEntryWithSource,
	FeatureBonusWithSource,
	PoolBonus,
	PoolLimits,
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
	override allGrantedPools(): PoolLimits[] {
		return this.data.data.grantedPools ? [...this.data.data.grantedPools] : [];
	}
	override allGrantedPoolBonuses(): PoolBonus[] {
		return this.data.data.grantedPoolBonuses ? [...this.data.data.grantedPoolBonuses] : [];
	}

	override canEmbedItem(): boolean {
		return false;
	}
}
