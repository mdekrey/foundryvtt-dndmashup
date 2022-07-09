import { SimpleDocument } from 'src/core/interfaces/simple-document';
import { MashupItemBase } from '../../mashup-item';
import { MashupItemEquipment } from '.';
import { EquipmentData, EquipmentDocument } from './dataSourceData';
import { ItemSlot } from './item-slots';

export function isEquipment(item: SimpleDocument): item is EquipmentDocument;
export function isEquipment<T extends ItemSlot>(item: SimpleDocument, itemType: T): item is EquipmentDocument<T>;
export function isEquipment(item: MashupItemBase): item is MashupItemEquipment;
export function isEquipment(
	item: SimpleDocument | MashupItemBase,
	itemType?: ItemSlot
): item is MashupItemEquipment | EquipmentDocument {
	return (
		item.type === 'equipment' && (itemType === undefined || (item.data as EquipmentData).data.itemSlot === itemType)
	);
}
