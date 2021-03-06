import { TypedData } from '@foundryvtt-dndmashup/foundry-compat';
import { ItemSlot } from '@foundryvtt-dndmashup/mashup-react';
import {
	ItemDataBaseProperties,
	ItemDataConstructorData,
	ItemDataSchema,
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData';
import { PropertiesToSource } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes';
import { BaseItem } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs';
import { EquipmentData } from '@foundryvtt-dndmashup/mashup-react';
import { ItemDataByType, PossibleItemSourceData, PossibleItemType } from '@foundryvtt-dndmashup/mashup-react';

export { PossibleItemType };

type ItemData<TSource extends TypedData<string, unknown>> = foundry.abstract.DocumentData<
	ItemDataSchema,
	ItemDataBaseProperties & TSource,
	PropertiesToSource<ItemDataBaseProperties> & TSource,
	ItemDataConstructorData,
	BaseItem
> &
	ItemDataBaseProperties &
	TSource;

declare global {
	interface SourceConfig {
		Item: PossibleItemSourceData;
	}
	interface DataConfig {
		Item: PossibleItemSourceData;
	}
}

export type PossibleItemData = {
	[K in PossibleItemType]: ItemData<ItemDataByType[K]>;
}[PossibleItemType];

export type SpecificItemData<T extends PossibleItemType> = PossibleItemData & { type: T };
export type SpecificItemEquipmentData<TItemSlot extends ItemSlot = ItemSlot> = SpecificItemData<'equipment'> &
	ItemData<EquipmentData<TItemSlot>>;
