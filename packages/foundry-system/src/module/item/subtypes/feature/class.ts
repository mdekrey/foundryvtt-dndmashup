import { DynamicListEntry, FeatureBonus, PoolBonus, PoolLimits } from '@foundryvtt-dndmashup/mashup-rules';
import { FeatureDocument } from '@foundryvtt-dndmashup/mashup-react';
import { MashupItem } from '../../mashup-item';

export class MashupItemFeature extends MashupItem<'feature'> implements FeatureDocument {
	override allGrantedBonuses(): FeatureBonus[] {
		return this.data.data.grantedBonuses;
	}
	override allDynamicList(): DynamicListEntry[] {
		return this.data.data.dynamicList;
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
