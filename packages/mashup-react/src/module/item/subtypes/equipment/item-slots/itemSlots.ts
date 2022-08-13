import { ArmorInfo } from './armor/info';
import { ImplementInfo } from './implement/info';
import { OtherInfo, ItemSlotDefaults } from './other/info';
import { ShieldInfo } from './shield/info';
import { ItemSlot, ItemSlotInfo } from './types';
import { WeaponInfo } from './weapon/info';

export const itemSlots: {
	[K in ItemSlot]: ItemSlotInfo<K>;
} = {
	'': OtherInfo,
	weapon: WeaponInfo,
	shield: ShieldInfo,
	implement: ImplementInfo,
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

export function getItemSlotInfo<T extends ItemSlot>(itemSlot: T): ItemSlotInfo<T> {
	return itemSlots[itemSlot] as ItemSlotInfo<T>;
}
