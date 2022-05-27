import { FeatureBonus } from 'src/module/bonuses';
import { SpecificItem } from '../mashup-item';
import { MashupItemSheet } from '../mashup-item-sheet';
import { PossibleItemData, SpecificItemData } from '../types';

export type SubItemFunctions<T extends PossibleItemData['type']> = {
	bonuses: (data: SpecificItemData<T>) => FeatureBonus[];
	prepare: (data: SpecificItemData<T>, item: SpecificItem<T>) => void;
	sheetData: (data: SpecificItemData<T>) => object;

	/** Final mutator for the sheet data before submission to Foundry */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	getSubmitSheetData: (data: any, item: SpecificItem<T>, sheet: MashupItemSheet) => any;
};
