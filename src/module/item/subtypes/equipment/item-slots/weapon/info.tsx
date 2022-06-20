import { ItemSlotInfo } from '../types';
import { weaponGroups } from './config';
import { WeaponDetails } from './details';

export const WeaponInfo: ItemSlotInfo<'weapon'> = {
	display: 'Weapon',
	optionLabel: 'Weapon',
	equippedSlots: ['primary-hand', 'off-hand'],
	slotsNeeded: (item) => item.equipmentProperties.hands,
	bonuses: () => [],
	defaultEquipmentInfo: {
		damage: '1d8',
		proficiencyBonus: 3,
		range: '',
		properties: [],
		group: 'heavy-blade',
		category: 'military',
		hands: 1,
	},
	buildSummary: ({ item: { equipmentProperties: input } }) => (
		<>
			{[
				`${input.hands}-handed ${input.category} ${input.group}, ${input.damage}, prof. +${input.proficiencyBonus}`,
				input.range,
				...input.properties,
			]
				.filter(Boolean)
				.join(', ')}
		</>
	),
	details: WeaponDetails,
	inventoryTableHeader: () => (
		<>
			<th>Group</th>
			<th>Damage</th>
			<th>Range</th>
		</>
	),
	inventoryTableBody: ({ item: { equipmentProperties } }) => (
		<>
			<td className="text-center">{weaponGroups[equipmentProperties.group]}</td>
			<td className="text-center">{equipmentProperties.damage}</td>
			<td className="text-center">{equipmentProperties.range || <>&mdash;</>}</td>
		</>
	),
	inventoryTableAddedCellCount: 3,
};
