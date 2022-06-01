import { ItemSlotInfo } from '../types';
import { ArmorDetails } from './details';

export const ArmorInfo: ItemSlotInfo<'armor'> = {
	display: 'Armor',
	optionLabel: 'Armor',
	bonuses: () => [],
	equippedSlots: ['body'],
	slotsNeeded: () => 1,
	defaultEquipmentInfo: { armorBonus: 0, type: 'light', category: 'cloth', checkPenalty: 0, speedPenalty: 0 },
	buildSummary: ({ equipmentProperties: input }) => (
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
	inventoryTableBody: ({ equipmentProperties }) => (
		<>
			<td className="text-center">{equipmentProperties.category}</td>
			<td className="text-center">{equipmentProperties.armorBonus}</td>
			<td className="text-center">{equipmentProperties.checkPenalty}</td>
			<td className="text-center">{equipmentProperties.speedPenalty}</td>
		</>
	),
};
