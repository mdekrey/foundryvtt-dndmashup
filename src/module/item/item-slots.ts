import { FeatureBonus } from '../bonuses';

export type ItemSlot =
	| ''
	| 'weapon'
	| 'shield'
	| 'armor'
	| 'arms'
	| 'feet'
	| 'hands'
	| 'head'
	| 'neck'
	| 'ring'
	| 'waist';
export type EquippedItemSlot =
	| 'primary-hand'
	| 'off-hand'
	| 'body'
	| 'arms'
	| 'feet'
	| 'hands'
	| 'head'
	| 'neck'
	| 'primary-ring'
	| 'secondary-ring'
	| 'waist';

type ArmorCategory = string; // TODO
type ArmorType = string; // TODO

export type ItemSlotTemplates = {
	weapon: {
		damage: string;
		proficiencyBonus: number;
		range: string | null;
		group: string;
		properties: string[];
		category: string;
		hands: string;
	};
	armor: {
		armorBonus: number;
		category: ArmorCategory;
		type: ArmorType;
	};
};

export type ItemSlotInfo<T extends ItemSlot> = {
	label: string;
	equippedSlots?: EquippedItemSlot[];
} & (T extends keyof ItemSlotTemplates
	? {
			bonuses: (inputData: ItemSlotTemplates[T]) => FeatureBonus[];
			defaultEquipmentInfo: ItemSlotTemplates[T];
	  }
	: {
			defaultEquipmentInfo: null;
	  });

export const itemSlots: {
	[K in ItemSlot]: ItemSlotInfo<K>;
} = {
	'': { label: 'None', equippedSlots: [], defaultEquipmentInfo: null },
	weapon: {
		label: 'Weapon',
		equippedSlots: ['primary-hand', 'off-hand'],
		bonuses: () => [],
		defaultEquipmentInfo: {
			damage: '1d8',
			proficiencyBonus: 3,
			range: null,
			properties: [],
			group: 'long-blade',
			category: 'Martial',
			hands: 'one',
		},
	},
	shield: { label: 'Shield', equippedSlots: ['off-hand'], defaultEquipmentInfo: null },
	armor: {
		label: 'Armor',
		bonuses: () => [],
		defaultEquipmentInfo: { armorBonus: 0, type: 'light', category: 'cloth' },
	},
	arms: { label: 'Arms', defaultEquipmentInfo: null },
	feet: { label: 'Feet', defaultEquipmentInfo: null },
	hands: { label: 'Hands', defaultEquipmentInfo: null },
	head: { label: 'Head', defaultEquipmentInfo: null },
	neck: { label: 'Neck', defaultEquipmentInfo: null },
	ring: { label: 'Ring', equippedSlots: ['primary-ring', 'secondary-ring'], defaultEquipmentInfo: null },
	waist: { label: 'Waist', defaultEquipmentInfo: null },
};
