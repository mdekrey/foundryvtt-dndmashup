import { FeatureBonus } from '../../bonuses';
import { AnyDocumentData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/data.mjs';

export type BaseItemTemplateDataSourceData = {
	grantedBonuses: FeatureBonus[];
	// This is an array of ItemDataConstructorData, or maybe PossibleItemData, but that causes typing problems
	items: (AnyDocumentData & { _id: string })[];
};

export type ItemDescriptionItemTemplateDataSourceData = {
	description: {
		text: string;
		// TODO: how would unidentified work?
		// unidentifiedText: string;
		// isIdentified: boolean;
	};
};

export type CarriedItemItemTemplateDataSourceData = {
	quantity: number;
	weight: number;
	price: number;
};
