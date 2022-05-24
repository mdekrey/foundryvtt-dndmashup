import { FeatureBonus } from 'src/module/bonuses';
import { MashupItem } from '../mashup-item';
import { PossibleItemData, SpecificItemData } from '../types';

export type SubItemFunctions<T extends PossibleItemData['type'], TSheetDataInput = object> = {
	bonuses: (data: SpecificItemData<T>) => FeatureBonus[];
	prepare: (data: SpecificItemData<T>, item: MashupItem) => void;
	sheetData: (data: SpecificItemData<T>) => TSheetDataInput;
	sheetDataConvert?: (data: SpecificItemData<T>['_source'] & TSheetDataInput) => SpecificItemData<T>['_source'];
};
