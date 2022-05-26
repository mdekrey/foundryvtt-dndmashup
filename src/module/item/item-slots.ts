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

export type WeaponCategory = 'simple' | 'military' | 'superior';
export type WeaponGroup =
	| 'axe'
	| 'bow'
	| 'crossbow'
	| 'flail'
	| 'hammer'
	| 'heavy-blade'
	| 'light-blade'
	| 'mace'
	| 'pick'
	| 'polearm'
	| 'sling'
	| 'spear'
	| 'staff'
	| 'unarmed';
export type WeaponProperties =
	| 'heavy-thrown'
	| 'high-crit'
	| 'light-thrown'
	| 'load'
	| 'off-hand'
	| 'reach'
	| 'small'
	| 'versatile';
export type ArmorCategory = 'cloth' | 'leather' | 'hide' | 'chainmail' | 'scale' | 'plate';
export type ArmorType = 'light' | 'heavy';
export type ShieldType = 'light' | 'heavy';

export type ItemSlotTemplates = {
	weapon: {
		damage: string;
		proficiencyBonus: number;
		range: string;
		group: WeaponGroup;
		properties: WeaponProperties[];
		category: WeaponCategory;
		hands: 1 | 2;
	};
	armor: {
		armorBonus: number;
		category: ArmorCategory;
		type: ArmorType;
		checkPenalty: number;
		speedPenalty: number;
	};
	shield: {
		type: ShieldType;
		shieldBonus: number;
		checkPenalty: number;
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
			range: '',
			properties: [],
			group: 'heavy-blade',
			category: 'military',
			hands: 1,
		},
	},
	shield: {
		label: 'Shield',
		equippedSlots: ['off-hand'],
		bonuses: () => [],
		defaultEquipmentInfo: { type: 'light', shieldBonus: 1, checkPenalty: 0 },
	},
	armor: {
		label: 'Armor',
		bonuses: () => [],
		defaultEquipmentInfo: { armorBonus: 0, type: 'light', category: 'cloth', checkPenalty: 0, speedPenalty: 0 },
	},
	arms: { label: 'Arms', defaultEquipmentInfo: null },
	feet: { label: 'Feet', defaultEquipmentInfo: null },
	hands: { label: 'Hands', defaultEquipmentInfo: null },
	head: { label: 'Head', defaultEquipmentInfo: null },
	neck: { label: 'Neck', defaultEquipmentInfo: null },
	ring: { label: 'Ring', equippedSlots: ['primary-ring', 'secondary-ring'], defaultEquipmentInfo: null },
	waist: { label: 'Waist', defaultEquipmentInfo: null },
};
