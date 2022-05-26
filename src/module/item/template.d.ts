import { FeatureBonus } from '../bonuses';
import { Ability, DataSource } from 'src/types/types';
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

declare global {
	interface SourceConfig {
		Item: ClassDataSource | RaceDataSource | EquipmentDataSource;
	}
}
