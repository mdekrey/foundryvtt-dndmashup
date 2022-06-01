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
		...ItemSlotDefaults,
	},
	feet: {
		display: 'Feet',
		optionLabel: 'Feet',
		...ItemSlotDefaults,
	},
	hands: {
		display: 'Hands',
		optionLabel: 'Hands',
		...ItemSlotDefaults,
	},
	head: {
		display: 'Head',
		optionLabel: 'Head',
		...ItemSlotDefaults,
	},
	neck: {
		display: 'Neck',
		optionLabel: 'Neck',
		...ItemSlotDefaults,
	},
	ring: {
		display: 'Ring',
		optionLabel: 'Ring',
		...ItemSlotDefaults,
		equippedSlots: ['primary-ring', 'secondary-ring'],
	},
	waist: {
		display: 'Waist',
		optionLabel: 'Waist',
		...ItemSlotDefaults,
	},
};
