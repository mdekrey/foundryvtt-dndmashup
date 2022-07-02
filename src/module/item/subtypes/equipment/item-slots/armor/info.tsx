import { ItemSlotInfo } from '../types';
import { defaultEquipmentInfo } from './armorEquipmentInfo';
import { allArmorCategories } from './config';
import { ArmorDetails } from './details';

export const ArmorInfo: ItemSlotInfo<'armor'> = {
	display: 'Armor',
	optionLabel: 'Armor',
	bonuses: () => [],
	equippedSlots: ['body'],
	slotsNeeded: () => 1,
	defaultEquipmentInfo,
	buildSummary: ({ item: { equipmentProperties: input } }) => (
		<>{`${input.type} ${input.category}, armor bonus +${input.armorBonus}, check penalty ${input.checkPenalty}, speed penalty ${input.speedPenalty}`}</>
	),
	details: ArmorDetails,
	inventoryTableHeader: () => (
		<>
			<th>Category</th>
			<th>Armor Bonus</th>
			<th>Check</th>
			<th>Speed</th>
		</>
	),
	inventoryTableBody: ({ item: { equipmentProperties } }) => (
		<>
			<td className="text-center">{allArmorCategories[equipmentProperties.category]}</td>
			<td className="text-center">{equipmentProperties.armorBonus}</td>
			<td className="text-center">{equipmentProperties.checkPenalty}</td>
			<td className="text-center">{equipmentProperties.speedPenalty}</td>
		</>
	),
	inventoryTableAddedCellCount: 4,
};
