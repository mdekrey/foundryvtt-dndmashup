import { FeatureBonus } from 'src/module/bonuses';
import { SpecificItem } from '../mashup-item';
import { PossibleItemData, SpecificItemData } from '../types';

export type SubItemFunctions<T extends PossibleItemData['type']> = {
	bonuses: (data: SpecificItemData<T>) => FeatureBonus[];
	prepare: (data: SpecificItemData<T>, item: SpecificItem<T>) => void;
};
