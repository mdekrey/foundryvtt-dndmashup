import { Ability, TypedData } from 'src/types/types';
import { ItemData } from './item.types';
import { FeatureBonus } from '../bonuses';
import { EquippedItemSlot, ItemSlot, ItemSlotTemplates } from './subtypes/equipment/item-slots';
import { FeatureType } from './subtypes/feature';

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

export type ClassDataSourceData = BaseItemTemplateDataSourceData & {
	role: string;
	powerSource: string;
	keyAbilities: Ability[];
	hpBase: number;
	hpPerLevel: number;
	healingSurgesBase: number;
};
export type RaceDataSourceData = BaseItemTemplateDataSourceData & {
	baseSpeed: number;
};
export type EquipmentDataSourceData<TItemSlot extends ItemSlot = ItemSlot> = BaseItemTemplateDataSourceData &
	ItemDescriptionItemTemplateDataSourceData &
	CarriedItemItemTemplateDataSourceData & {
		itemSlot: TItemSlot;
		equipped: EquippedItemSlot[];
		equipmentProperties?: TItemSlot extends keyof ItemSlotTemplates ? ItemSlotTemplates[TItemSlot] : null;
	};
export type FeatureDataSourceData = BaseItemTemplateDataSourceData &
	ItemDescriptionItemTemplateDataSourceData & {
		featureType: FeatureType;
	};

export type ClassData = TypedData<'class', ClassDataSourceData>;
export type RaceData = TypedData<'race', RaceDataSourceData>;
export type EquipmentData<TItemSlot extends ItemSlot = ItemSlot> = TypedData<
	'equipment',
	EquipmentDataSourceData<TItemSlot>
>;
export type FeatureData = TypedData<'feature', FeatureDataSourceData>;

declare global {
	interface SourceConfig {
		Item: ClassData | RaceData | EquipmentData | FeatureData;
	}
	interface DataConfig {
		Item: ClassData | RaceData | EquipmentData | FeatureData;
	}
}

export type PossibleItemData =
	| ItemData<ClassData, ClassData>
	| ItemData<RaceData, RaceData>
	| ItemData<EquipmentData, EquipmentData>
	| ItemData<FeatureData, FeatureData>;

export type PossibleItemType = PossibleItemData['type'];

export type SpecificItemData<T extends PossibleItemType> = PossibleItemData & { type: T };
export type SpecificItemEquipmentData<TItemSlot extends ItemSlot = ItemSlot> = SpecificItemData<'equipment'> &
	ItemData<EquipmentData<TItemSlot>, EquipmentData<TItemSlot>>;
