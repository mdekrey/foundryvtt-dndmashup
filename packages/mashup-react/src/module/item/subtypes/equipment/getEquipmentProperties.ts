import { EquipmentData } from './dataSourceData';
import { getItemSlotInfo, ItemSlot, ItemSlotTemplate } from './item-slots';

export function getEquipmentProperties<TItemSlot extends ItemSlot = ItemSlot>(data: EquipmentData<TItemSlot>) {
	return (data.data.equipmentProperties ?? {
		...getItemSlotInfo(data.data.itemSlot).defaultEquipmentInfo,
	}) as ItemSlotTemplate<TItemSlot>;
}
