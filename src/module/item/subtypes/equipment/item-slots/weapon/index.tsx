import { ItemSlotInfo } from '../types';
import { WeaponDetails } from './details';

export const WeaponInfo: ItemSlotInfo<'weapon'> = {
	display: 'Weapon',
	optionLabel: 'Weapon',
	equippedSlots: ['primary-hand', 'off-hand'],
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
	buildSummary: (input) =>
		`${input.hands}-handed ${input.category} ${input.group}, ${input.damage}, prof. +${input.proficiencyBonus}, ${[
			input.range,
			...input.properties,
		]
			.filter(Boolean)
			.join(', ')}`,
	details: WeaponDetails,
};
