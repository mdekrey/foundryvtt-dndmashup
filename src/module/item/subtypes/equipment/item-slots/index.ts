import { ArmorInfo } from './armor';
import { OtherInfo, ItemSlotDefaults } from './other';
import { ShieldInfo } from './shield';
import { ItemSlot, ItemSlotInfo } from './types';
import { WeaponInfo } from './weapon';

export * from './types';

export const itemSlots: {
	[K in ItemSlot]: ItemSlotInfo<K>;
} = {
	'': OtherInfo,
	weapon: WeaponInfo,
	shield: ShieldInfo,
	armor: ArmorInfo,
	arms: {
		display: 'Arms',
		optionLabel: 'Arms',
		equippedSlots: ['arms'],
		...ItemSlotDefaults,
	},
	feet: {
		display: 'Feet',
		optionLabel: 'Feet',
		equippedSlots: ['feet'],
		...ItemSlotDefaults,
	},
	hands: {
		display: 'Hands',
		optionLabel: 'Hands',
		equippedSlots: ['hands'],
		...ItemSlotDefaults,
	},
	head: {
		display: 'Head',
		optionLabel: 'Head',
		equippedSlots: ['head'],
		...ItemSlotDefaults,
	},
	neck: {
		display: 'Neck',
		optionLabel: 'Neck',
		equippedSlots: ['neck'],
		...ItemSlotDefaults,
	},
	ring: {
		display: 'Ring',
		optionLabel: 'Ring',
		equippedSlots: ['primary-ring', 'secondary-ring'],
		...ItemSlotDefaults,
	},
	waist: {
		display: 'Waist',
		optionLabel: 'Waist',
		equippedSlots: ['waist'],
		...ItemSlotDefaults,
	},
};
