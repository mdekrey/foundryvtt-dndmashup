import { SpecificItem } from '../mashup-item';
import { MashupItemSheet } from '../mashup-item-sheet';
import { PossibleItemData } from '../types';
import { ClassSheet } from './ClassSheet';

function isItemType<T extends PossibleItemData['type']>(item: SpecificItem, type: T): item is SpecificItem<T> {
	return item.data.type === type;
}

export function ItemSheetJsx({ sheet }: { sheet: MashupItemSheet }) {
	const item = sheet.item as SpecificItem;

	return isItemType(item, 'class') ? <ClassSheet item={item} /> : null;
}
