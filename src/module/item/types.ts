import {
	BaseItemTemplateDataSourceData,
	ClassDataSource,
	ClassDataSourceData,
	RaceDataSource,
	RaceDataSourceData,
} from 'src/template.types';
import { ItemData } from './item.types';

// TODO - any calculated properties? See actor/types.ts

export type CommonDataProperties = BaseItemTemplateDataSourceData;

export type ClassDataProperties = Merge<ClassDataSourceData, CommonDataProperties>;

export type RaceDataProperties = Merge<RaceDataSourceData, CommonDataProperties>;
export type ClassData = { type: 'class'; data: ClassDataProperties };
export type RaceData = { type: 'race'; data: RaceDataProperties };

declare global {
	interface DataConfig {
		Item: ClassData | RaceData;
	}
}

export type PossibleItemData = ItemData<ClassData, ClassDataSource> | ItemData<RaceData, RaceDataSource>;

export type SpecificItemData<T extends PossibleItemData['type']> = PossibleItemData & { type: T };
