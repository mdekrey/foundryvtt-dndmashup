import { EquipmentData } from './dataSourceData';
import { getItemSlotInfo, ItemSlot, ItemSlotTemplate } from './item-slots';

export function getEquipmentProperties<TItemSlot extends ItemSlot = ItemSlot>(data: EquipmentData<TItemSlot>) {
	return (data.system.equipmentProperties ?? {
		...getItemSlotInfo(data.system.itemSlot).defaultEquipmentInfo,
	}) as ItemSlotTemplate<TItemSlot>;
}
