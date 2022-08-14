import { EquippedItemSlot, ItemSlot, ItemSlotTemplates } from './item-slots';
import {
	BaseItemTemplateDataSourceData,
	ItemDescriptionItemTemplateDataSourceData,
	CarriedItemItemTemplateDataSourceData,
} from '../../templates/bases';
import { TypedData } from '@foundryvtt-dndmashup/foundry-compat';
import { ItemDocument } from '../../item-data-types-template';
import { FeatureBonus } from '@foundryvtt-dndmashup/mashup-rules';

export type EquipmentDataSourceData<TItemSlot extends ItemSlot = ItemSlot> = BaseItemTemplateDataSourceData &
	ItemDescriptionItemTemplateDataSourceData &
	CarriedItemItemTemplateDataSourceData & {
		itemSlot: TItemSlot;
		equipmentProperties?: TItemSlot extends keyof ItemSlotTemplates
			? ItemSlotTemplates[TItemSlot]
			: Record<string, never>;
		equipped: EquippedItemSlot[];
		container: boolean;
	};

export type EquipmentData<TItemSlot extends ItemSlot = ItemSlot> = TypedData<
	'equipment',
	EquipmentDataSourceData<TItemSlot>
>;

export type EquipmentDocument<TItemSlot extends ItemSlot = ItemSlot> = ItemDocument<EquipmentData<TItemSlot>> & {
	allGrantedBonuses(isForPowerUse?: boolean): FeatureBonus[];
};
