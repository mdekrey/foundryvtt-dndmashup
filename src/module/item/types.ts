import { Ability, TypedData } from 'src/types/types';
import { ItemData } from './item.types';
import { FeatureBonus } from '../bonuses';
import { EquippedItemSlot, ItemSlot, ItemSlotTemplates } from './subtypes/equipment/item-slots';

export type BaseItemTemplateDataSourceData = {
	grantedBonuses: FeatureBonus[];
};

export type ItemDescriptionItemTemplateDataSourceData = {
	description: {
		text: string;
		// TODO: how would unidentified work?
		// unidentifiedText: string;
		// isIdentified: boolean;
	};
};

export type CarriedItemItemTemplateDataSourceData = {
	quantity: number;
	weight: number;
	price: number;
};

export type ClassDataSourceData = Merge<
	BaseItemTemplateDataSourceData,
	{
		role: string;
		powerSource: string;
		keyAbilities: Ability[];
		hpBase: number;
		hpPerLevel: number;
		healingSurgesBase: number;
	}
>;
export type RaceDataSourceData = Merge<
	BaseItemTemplateDataSourceData,
	{
		baseSpeed: number;
	}
>;
export type EquipmentDataSourceData<TItemSlot extends ItemSlot = ItemSlot> = Merge<
	BaseItemTemplateDataSourceData,
	ItemDescriptionItemTemplateDataSourceData &
		CarriedItemItemTemplateDataSourceData & {
			itemSlot: TItemSlot;
			equipped: EquippedItemSlot[];
			equipmentProperties?: TItemSlot extends keyof ItemSlotTemplates ? ItemSlotTemplates[TItemSlot] : null;
		}
>;

export type ClassData = TypedData<'class', ClassDataSourceData>;
export type RaceData = TypedData<'race', RaceDataSourceData>;
export type EquipmentData<TItemSlot extends ItemSlot = ItemSlot> = TypedData<
	'equipment',
	EquipmentDataSourceData<TItemSlot>
>;

declare global {
	interface SourceConfig {
		Item: ClassData | RaceData | EquipmentData;
	}
	interface DataConfig {
		Item: ClassData | RaceData | EquipmentData;
	}
}

export type PossibleItemData =
	| ItemData<ClassData, ClassData>
	| ItemData<RaceData, RaceData>
	| ItemData<EquipmentData, EquipmentData>;

export type SpecificItemData<T extends PossibleItemData['type']> = PossibleItemData & { type: T };
export type SpecificItemEquipmentData<TItemSlot extends ItemSlot = ItemSlot> = SpecificItemData<'equipment'> &
	ItemData<EquipmentData<TItemSlot>, EquipmentData<TItemSlot>>;
