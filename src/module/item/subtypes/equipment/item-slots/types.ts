import { FeatureBonus } from 'src/module/bonuses';
import { SpecificEquipmentItem } from 'src/module/item/mashup-item';

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
export type WeaponProperty =
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
		properties: WeaponProperty[];
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

export type ItemSlotTemplate<T extends ItemSlot = ItemSlot> = {
	[K in T]: T extends keyof ItemSlotTemplates ? ItemSlotTemplates[T] : Record<string, never>;
}[T];

export type ItemSlotComponent<T extends ItemSlot = ItemSlot> = React.FC<{
	item: SpecificEquipmentItem<T>;
	equipmentProperties: ItemSlotTemplate<T>;
}>;

export type ItemSlotInfo<T extends ItemSlot = ItemSlot> = {
	display: string;
	optionLabel: string;
	equippedSlots: EquippedItemSlot[];
	slotsNeeded: (item: SpecificEquipmentItem<T>, equipmentProperties: ItemSlotTemplate<T>) => number;
	bonuses: (inputData: ItemSlotTemplate<T>) => FeatureBonus[];
	defaultEquipmentInfo: ItemSlotTemplate<T>;
	buildSummary: ItemSlotComponent<T>;
	details: ItemSlotComponent<T>;
	inventoryTableHeader: React.FC;
	inventoryTableBody: ItemSlotComponent<T>;
};
