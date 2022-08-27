import { ItemSlotInfo } from '../types';
import { ShieldDetails } from './details';
import { defaultEquipmentInfo } from './sheildEquipmentInfo';

export const ShieldInfo: ItemSlotInfo<'shield'> = {
	display: 'Shield',
	optionLabel: 'Shield',
	equippedSlots: ['off-hand'],
	slotsNeeded: () => 1,
	bonuses: ({ shieldBonus }) => [
		{ amount: shieldBonus, condition: null, target: 'defense-ac', type: 'shield' },
		{ amount: shieldBonus, condition: null, target: 'defense-refl', type: 'shield' },
	],
	defaultEquipmentInfo,
	buildSummary: ({ equipmentProperties: input }) => (
		<>{`${input.type}, shield bonus +${input.shieldBonus}, check penalty ${input.checkPenalty}`}</>
	),
	details: ShieldDetails,
	inventoryTableHeader: () => (
		<>
			<th>Shield Bonus</th>
			<th>Check</th>
		</>
	),
	inventoryTableBody: ({ equipmentProperties }) => (
		<>
			<td className="text-center">{equipmentProperties.shieldBonus}</td>
			<td className="text-center">{equipmentProperties.checkPenalty}</td>
		</>
	),
	statsPreview: ({ equipmentProperties }) => <div>{/* TODO */}</div>,
};
