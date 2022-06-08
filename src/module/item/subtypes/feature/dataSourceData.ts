import { FeatureType } from './config';
import { BaseItemTemplateDataSourceData, ItemDescriptionItemTemplateDataSourceData } from '../../templates/bases';
import { TypedData } from 'src/types/types';

export type FeatureDataSourceData = BaseItemTemplateDataSourceData &
	ItemDescriptionItemTemplateDataSourceData & {
		featureType: FeatureType;
		summary: string;
	};

export type FeatureData = TypedData<'feature', FeatureDataSourceData>;
