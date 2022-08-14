import { FeatureBonus } from '../../../bonuses';
import { PossibleItemSourceData } from '../item-data-types-template';

export type BaseItemTemplateDataSourceData = {
	sourceId: string;
	grantedBonuses: FeatureBonus[];
	items: PossibleItemSourceData[];
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
