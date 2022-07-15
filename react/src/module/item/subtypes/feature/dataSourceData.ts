import { FeatureType } from './config';
import { BaseItemTemplateDataSourceData, ItemDescriptionItemTemplateDataSourceData } from '../../templates/bases';
import { TypedData } from 'src/types/types';
import { ItemDocument } from '../../item-data-types-template';

export type FeatureDataSourceData = BaseItemTemplateDataSourceData &
	ItemDescriptionItemTemplateDataSourceData & {
		featureType: FeatureType;
		summary: string;
	};

export type FeatureData = TypedData<'feature', FeatureDataSourceData>;

export type FeatureDocument = ItemDocument<FeatureData>;
