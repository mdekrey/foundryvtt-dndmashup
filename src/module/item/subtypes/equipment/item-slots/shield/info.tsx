import { ItemSlotInfo } from '../types';
import { ShieldDetails } from './details';

export const ShieldInfo: ItemSlotInfo<'shield'> = {
	display: 'Shield',
	optionLabel: 'Shield',
	equippedSlots: ['off-hand'],
	slotsNeeded: () => 1,
	bonuses: () => [],
	defaultEquipmentInfo: { type: 'light', shieldBonus: 1, checkPenalty: 0 },
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
