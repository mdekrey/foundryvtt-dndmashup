import { Ability, DataSource } from 'src/types/types';
import { ItemData } from './item.types';
import { FeatureBonus } from '../bonuses';
import { ItemSlotTemplates } from './item-slots';

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
type ItemSlot = 'weapon' | 'body';
type EquippedItemSlot = 'weapon-primary' | 'weapon-off-hand' | 'body';
export type EquipmentDataSourceData = Merge<
	BaseItemTemplateDataSourceData,
	ItemDescriptionItemTemplateDataSourceData &
		CarriedItemItemTemplateDataSourceData & {
			itemSlot: ItemSlot;
			equipped: '' | EquippedItemSlot;
			equipmentProperties?: ItemSlotTemplates[keyof ItemSlotTemplates] | null;
		}
>;

export type ClassDataSource = DataSource<'class', ClassDataSourceData>;
export type RaceDataSource = DataSource<'race', RaceDataSourceData>;
export type EquipmentDataSource = DataSource<'equipment', EquipmentDataSourceData>;

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
