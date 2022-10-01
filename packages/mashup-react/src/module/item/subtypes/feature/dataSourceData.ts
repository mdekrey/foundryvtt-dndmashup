import { Aura, PoolBonus, PoolLimits, TriggeredEffect } from '@foundryvtt-dndmashup/mashup-rules';
import { TypedData } from '@foundryvtt-dndmashup/foundry-compat';
import { BaseItemTemplateDataSourceData, ItemDescriptionItemTemplateDataSourceData } from '../../templates/bases';
import { ItemDocument } from '../../item-data-types-template';
import { FeatureType } from './config';

export type FeatureDataSourceData = BaseItemTemplateDataSourceData &
	ItemDescriptionItemTemplateDataSourceData & {
		featureType: FeatureType;
		summary: string;

		grantedPools?: PoolLimits[];
		grantedPoolBonuses?: PoolBonus[];
		grantedAuras?: Aura[];
		triggeredEffects?: TriggeredEffect[];
	};

export type FeatureSystemData = FeatureDataSourceData;
export type FeatureData = TypedData<'feature', FeatureSystemData>;

export type FeatureDocument = ItemDocument<FeatureData>;
