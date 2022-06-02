import { FeatureBonus } from 'src/module/bonuses';
import { SpecificEquipmentItem } from 'src/module/item/mashup-item';
import { ArmorItemSlotTemplate } from './armor/types';
import { ShieldItemSlotTemplate } from './shield/types';
import { WeaponItemSlotTemplate } from './weapon/types';

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

export type ItemSlotTemplates = {
	weapon: WeaponItemSlotTemplate;
	armor: ArmorItemSlotTemplate;
	shield: ShieldItemSlotTemplate;
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
