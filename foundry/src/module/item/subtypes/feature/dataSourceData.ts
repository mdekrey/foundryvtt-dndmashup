import { FeatureType } from './config';
import { BaseItemTemplateDataSourceData, ItemDescriptionItemTemplateDataSourceData } from '../../templates/bases';
import { TypedData } from 'dndmashup-react/types/types';
import { SimpleDocument } from 'dndmashup-react/core/interfaces/simple-document';

export type FeatureDataSourceData = BaseItemTemplateDataSourceData &
	ItemDescriptionItemTemplateDataSourceData & {
		featureType: FeatureType;
		summary: string;
	};

export type FeatureData = TypedData<'feature', FeatureDataSourceData>;

export type FeatureDocument = SimpleDocument<FeatureData>;
