import { Aura, PoolBonus, PoolLimits } from '@foundryvtt-dndmashup/mashup-rules';
import { TypedData } from '@foundryvtt-dndmashup/foundry-compat';
import { TriggeredEffect } from '../../../../effects';
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

export type FeatureData = TypedData<'feature', FeatureDataSourceData>;

export type FeatureDocument = ItemDocument<FeatureData>;
