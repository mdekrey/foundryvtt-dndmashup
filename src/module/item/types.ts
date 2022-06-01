import { Ability, DataSource } from 'src/types/types';
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
			equipped: '' | EquippedItemSlot;
			equipmentProperties?: TItemSlot extends keyof ItemSlotTemplates ? ItemSlotTemplates[TItemSlot] : null;
		}
>;

export type ClassDataSource = DataSource<'class', ClassDataSourceData>;
export type RaceDataSource = DataSource<'race', RaceDataSourceData>;
export type EquipmentDataSource<TItemSlot extends ItemSlot = ItemSlot> = DataSource<
	'equipment',
	EquipmentDataSourceData<TItemSlot>
>;

// TODO - any calculated properties? See actor/types.ts

export type CommonDataProperties = BaseItemTemplateDataSourceData;

export type ClassDataProperties = ClassDataSourceData;
export type RaceDataProperties = RaceDataSourceData;
export type EquipmentDataProperties = EquipmentDataSourceData;
export type ClassData = { type: 'class'; data: ClassDataProperties };
export type RaceData = { type: 'race'; data: RaceDataProperties };
export type EquipmentData = {
	type: 'equipment';
	data: EquipmentDataProperties;
};

declare global {
	interface SourceConfig {
		Item: ClassDataSource | RaceDataSource | EquipmentDataSource;
	}
	interface DataConfig {
		Item: ClassData | RaceData | EquipmentData;
	}
}

export type PossibleItemData =
	| ItemData<ClassData, ClassDataSource>
	| ItemData<RaceData, RaceDataSource>
	| ItemData<EquipmentData, EquipmentDataSource>;

export type SpecificItemData<T extends PossibleItemData['type']> = PossibleItemData & { type: T };
export type SpecificItemEquipmentData<TItemSlot extends ItemSlot = ItemSlot> = SpecificItemData<'equipment'> &
	ItemData<EquipmentData, EquipmentDataSource<TItemSlot>>;
