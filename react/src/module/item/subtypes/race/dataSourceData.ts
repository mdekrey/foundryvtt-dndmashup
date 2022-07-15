import { SimpleDocument } from 'src/core/interfaces/simple-document';
import { TypedData } from 'src/types/types';
import { BaseItemTemplateDataSourceData } from '../../templates/bases';

export type RaceDataSourceData = BaseItemTemplateDataSourceData & {
	baseSpeed: number;
};

export type RaceData = TypedData<'race', RaceDataSourceData>;

export type RaceDocument = SimpleDocument<RaceData>;