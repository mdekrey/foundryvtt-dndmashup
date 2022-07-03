import { ItemSlotInfo } from '../types';
import { ShieldDetails } from './details';
import { defaultEquipmentInfo } from './sheildEquipmentInfo';

export const ShieldInfo: ItemSlotInfo<'shield'> = {
	display: 'Shield',
	optionLabel: 'Shield',
	equippedSlots: ['off-hand'],
	slotsNeeded: () => 1,
	bonuses: () => [],
	defaultEquipmentInfo,
	buildSummary: ({ item: { equipmentProperties: input } }) => (
		<>{`${input.type}, shield bonus +${input.shieldBonus}, check penalty ${input.checkPenalty}`}</>
	),
	details: ShieldDetails,
	inventoryTableHeader: () => (
		<>
			<th>Shield Bonus</th>
			<th>Check</th>
		</>
	),
	inventoryTableBody: ({ item: { equipmentProperties } }) => (
		<>
			<td className="text-center">{equipmentProperties.shieldBonus}</td>
			<td className="text-center">{equipmentProperties.checkPenalty}</td>
		</>
	),
	inventoryTableAddedCellCount: 2,
};
