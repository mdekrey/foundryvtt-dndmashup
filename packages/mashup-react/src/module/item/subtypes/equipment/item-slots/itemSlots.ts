import { ArmorInfo } from './armor/info';
import { ImplementInfo } from './implement/info';
import { OtherInfo, itemSlotDefaults } from './other/info';
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
		equippedSlots: ['arms'],
		...itemSlotDefaults('Arms'),
	},
	feet: {
		equippedSlots: ['feet'],
		...itemSlotDefaults('Feet'),
	},
	hands: {
		equippedSlots: ['hands'],
		...itemSlotDefaults('Hands'),
	},
	head: {
		equippedSlots: ['head'],
		...itemSlotDefaults('Head'),
	},
	neck: {
		equippedSlots: ['neck'],
		...itemSlotDefaults('Neck'),
	},
	ring: {
		equippedSlots: ['primary-ring', 'secondary-ring'],
		...itemSlotDefaults('Ring'),
	},
	waist: {
		equippedSlots: ['waist'],
		...itemSlotDefaults('Waist'),
	},
};

export function getItemSlotInfo<T extends ItemSlot>(itemSlot: T): ItemSlotInfo<T> {
	return itemSlots[itemSlot] as ItemSlotInfo<T>;
}
