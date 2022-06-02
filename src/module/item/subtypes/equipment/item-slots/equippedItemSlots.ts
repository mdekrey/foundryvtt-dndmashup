import { EquippedItemSlot } from './types';

type EquippedItemSlotConfig = {
	label: string;
};

export const equippedItemSlots: Record<EquippedItemSlot, EquippedItemSlotConfig> = {
	'primary-hand': {
		label: 'Primary Hand',
	},
	'off-hand': {
		label: 'Off Hand',
	},
	body: {
		label: 'Body',
	},
	arms: {
		label: 'Arms',
	},
	feet: {
		label: 'Feet',
	},
	hands: {
		label: 'Hands',
	},
	head: {
		label: 'Head',
	},
	neck: {
		label: 'Neck',
	},
	'primary-ring': {
		label: 'Primary Ring',
	},
	'secondary-ring': {
		label: 'Secondary Ring',
	},
	waist: {
		label: 'Waist',
	},
};
