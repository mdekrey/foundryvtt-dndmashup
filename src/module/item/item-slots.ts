import { FeatureBonus } from '../bonuses';
import { ArmorDetails } from './components/equipment/ArmorDetails';
import { OtherDetails } from './components/equipment/OtherDetails';
import { ShieldDetails } from './components/equipment/ShieldDetails';
import { WeaponDetails } from './components/equipment/WeaponDetails';
import { SpecificEquipmentItem } from './mashup-item';

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

export type ItemSlotInfoBase = {
	label: string;
	equippedSlots?: EquippedItemSlot[];
	bonuses?: (inputData: ItemSlotTemplates[keyof ItemSlotTemplates]) => FeatureBonus[];
	defaultEquipmentInfo: ItemSlotTemplates[keyof ItemSlotTemplates] | null;
	buildSummary?: (inputData: ItemSlotTemplates[keyof ItemSlotTemplates]) => string;
	details: React.FC<{ item: SpecificEquipmentItem }>;
};

type DetailsComponent = React.FC<{ item: SpecificEquipmentItem }>;

export type ItemSlotInfo<T extends ItemSlot> = Omit<ItemSlotInfoBase, 'bonuses' | 'buildSummary'> &
	(T extends keyof ItemSlotTemplates
		? {
				bonuses: (inputData: ItemSlotTemplates[T]) => FeatureBonus[];
				defaultEquipmentInfo: ItemSlotTemplates[T];
				buildSummary: (inputData: ItemSlotTemplates[T]) => string;
		  }
		: {
				defaultEquipmentInfo: null;
				bonuses?: undefined;
				buildSummary?: undefined;
		  });

export const itemSlots: {
	[K in ItemSlot]: ItemSlotInfo<K>;
} = {
	'': { label: 'None', equippedSlots: [], defaultEquipmentInfo: null, details: OtherDetails },
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
		buildSummary: (input) =>
			`${input.hands}-handed ${input.category} ${input.group}, ${input.damage}, prof. +${input.proficiencyBonus}, ${[
				input.range,
				...input.properties,
			]
				.filter(Boolean)
				.join(', ')}`,
		details: WeaponDetails as DetailsComponent,
	},
	shield: {
		label: 'Shield',
		equippedSlots: ['off-hand'],
		bonuses: () => [],
		defaultEquipmentInfo: { type: 'light', shieldBonus: 1, checkPenalty: 0 },
		buildSummary: (input) => `${input.type}, shield bonus +${input.shieldBonus}, check penalty ${input.checkPenalty}`,
		details: ShieldDetails as DetailsComponent,
	},
	armor: {
		label: 'Armor',
		bonuses: () => [],
		defaultEquipmentInfo: { armorBonus: 0, type: 'light', category: 'cloth', checkPenalty: 0, speedPenalty: 0 },
		buildSummary: (input) =>
			`${input.type} ${input.category}, armor bonus +${input.armorBonus}, check penalty ${input.checkPenalty}, speed penalty ${input.speedPenalty}`,
		details: ArmorDetails as DetailsComponent,
	},
	arms: { label: 'Arms', defaultEquipmentInfo: null, details: OtherDetails },
	feet: { label: 'Feet', defaultEquipmentInfo: null, details: OtherDetails },
	hands: { label: 'Hands', defaultEquipmentInfo: null, details: OtherDetails },
	head: { label: 'Head', defaultEquipmentInfo: null, details: OtherDetails },
	neck: { label: 'Neck', defaultEquipmentInfo: null, details: OtherDetails },
	ring: {
		label: 'Ring',
		equippedSlots: ['primary-ring', 'secondary-ring'],
		defaultEquipmentInfo: null,
		details: OtherDetails,
	},
	waist: { label: 'Waist', defaultEquipmentInfo: null, details: OtherDetails },
};
