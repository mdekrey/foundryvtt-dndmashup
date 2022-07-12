import { SimpleDocument } from 'dndmashup-react/core/interfaces/simple-document';
import { MashupItemBase } from '../../mashup-item';
import { MashupItemEquipment } from './config';
import { EquipmentDocument } from './dataSourceData';
import { ItemSlot } from './item-slots';

export function isEquipment(item: SimpleDocument): item is EquipmentDocument;
export function isEquipment(item: MashupItemBase): item is MashupItemEquipment;
export function isEquipment(item: SimpleDocument | MashupItemBase): item is MashupItemEquipment | EquipmentDocument {
	return item.type === 'equipment';
}

export function isEquipmentSlot<T extends ItemSlot>(item: SimpleDocument, itemType: T): item is EquipmentDocument<T> {
	return isEquipment(item) && item.data.data.itemSlot === itemType;
}
