import {
	EquipmentSystemData,
	ItemSlot,
	SpecificItemDataSource,
	SpecificItemSystemData,
} from '@foundryvtt-dndmashup/mashup-react';
import { EquipmentData } from '@foundryvtt-dndmashup/mashup-react';
import { PossibleItemDataSource, PossibleItemType } from '@foundryvtt-dndmashup/mashup-react';

export { PossibleItemType };

declare global {
	interface SourceConfig {
		Item: PossibleItemDataSource;
	}
	interface DataConfig {
		Item: PossibleItemDataSource;
	}
}

export type SpecificItemEquipmentSystemData<TItemSlot extends ItemSlot = ItemSlot> =
	SpecificItemSystemData<'equipment'> & EquipmentSystemData<TItemSlot>;

export type SpecificItemEquipmentDataSource<TItemSlot extends ItemSlot = ItemSlot> =
	SpecificItemDataSource<'equipment'> & EquipmentData<TItemSlot>;
