import { MashupItemSheet } from '../mashup-item-sheet';
import { MashupItemClass } from '../subtypes/class';
import { MashupItemEquipment } from '../subtypes/equipment';
import { MashupItemRace } from '../subtypes/race';
import { ClassSheet } from './ClassSheet';
import { EquipmentSheet } from './EquipmentSheet';
import { RaceSheet } from './RaceSheet';

export function ItemSheetJsx({ sheet }: { sheet: MashupItemSheet }) {
	const item = sheet.item;

	return item instanceof MashupItemClass ? (
		<ClassSheet item={item} />
	) : item instanceof MashupItemRace ? (
		<RaceSheet item={item} />
	) : item instanceof MashupItemEquipment ? (
		<EquipmentSheet item={item as MashupItemEquipment} />
	) : null;
}
