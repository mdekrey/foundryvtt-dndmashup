import { FeatureBonus, DynamicListEntry } from '@foundryvtt-dndmashup/mashup-rules';
import { PossibleItemDataSource } from '../item-data-types-template';

export type BaseItemTemplateDataSourceData = {
	sourceId: string;
	grantedBonuses: FeatureBonus[];
	dynamicList: DynamicListEntry[];
	items: PossibleItemDataSource[];
};

export type ItemDescriptionItemTemplateDataSourceData = {
	description: {
		text: string;
	};
};

export type CarriedItemItemTemplateDataSourceData = {
	quantity: number;
	weight: number;
	price: number;
};
