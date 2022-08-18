import { PoolBonus, PoolLimits } from '@foundryvtt-dndmashup/mashup-rules';
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
	};

export type FeatureData = TypedData<'feature', FeatureDataSourceData>;

export type FeatureDocument = ItemDocument<FeatureData>;
