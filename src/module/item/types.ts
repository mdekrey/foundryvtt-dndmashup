import type {
	BaseItemTemplateDataSourceData,
	ClassDataSource,
	ClassDataSourceData,
	EquipmentDataSource,
	EquipmentDataSourceData,
	RaceDataSource,
	RaceDataSourceData,
} from './template';
import { ItemData } from './item.types';

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
	interface DataConfig {
		Item: ClassData | RaceData | EquipmentData;
	}
}

export type PossibleItemData =
	| ItemData<ClassData, ClassDataSource>
	| ItemData<RaceData, RaceDataSource>
	| ItemData<EquipmentData, EquipmentDataSource>;

export type SpecificItemData<T extends PossibleItemData['type']> = PossibleItemData & { type: T };
