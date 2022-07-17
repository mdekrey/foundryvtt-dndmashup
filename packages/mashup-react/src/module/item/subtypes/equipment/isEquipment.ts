import { SimpleDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { EquipmentDocument } from './dataSourceData';
import { ItemSlot } from './item-slots';

export function isEquipment(item: SimpleDocument): item is EquipmentDocument {
	return item.type === 'equipment';
}

export function isEquipmentSlot<T extends ItemSlot>(item: SimpleDocument, itemType: T): item is EquipmentDocument<T> {
	return isEquipment(item) && item.data.data.itemSlot === itemType;
}
