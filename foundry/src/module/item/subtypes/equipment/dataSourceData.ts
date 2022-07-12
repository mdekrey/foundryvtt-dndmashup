import { EquippedItemSlot, ItemSlot, ItemSlotTemplates } from './item-slots';
import {
	BaseItemTemplateDataSourceData,
	ItemDescriptionItemTemplateDataSourceData,
	CarriedItemItemTemplateDataSourceData,
} from '../../templates/bases';
import { TypedData } from 'dndmashup-react/types/types';
import { SimpleDocument } from 'dndmashup-react/core/interfaces/simple-document';

export type EquipmentDataSourceData<TItemSlot extends ItemSlot = ItemSlot> = BaseItemTemplateDataSourceData &
	ItemDescriptionItemTemplateDataSourceData &
	CarriedItemItemTemplateDataSourceData & {
		itemSlot: TItemSlot;
		equipped: EquippedItemSlot[];
		equipmentProperties?: TItemSlot extends keyof ItemSlotTemplates ? ItemSlotTemplates[TItemSlot] : null;
		container: boolean;
	};

export type EquipmentData<TItemSlot extends ItemSlot = ItemSlot> = TypedData<
	'equipment',
	EquipmentDataSourceData<TItemSlot>
>;

export type EquipmentDocument<TItemSlot extends ItemSlot = ItemSlot> = SimpleDocument<EquipmentData<TItemSlot>>;
