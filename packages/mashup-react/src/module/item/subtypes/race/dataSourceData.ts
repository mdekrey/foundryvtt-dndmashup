import { TypedData } from 'src/types/types';
import { ItemDocument } from '../../item-data-types-template';
import { BaseItemTemplateDataSourceData } from '../../templates/bases';

export type RaceDataSourceData = BaseItemTemplateDataSourceData & {
	baseSpeed: number;
};

export type RaceData = TypedData<'race', RaceDataSourceData>;

export type RaceDocument = ItemDocument<RaceData>;
