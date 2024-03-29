import { TypedData } from '@foundryvtt-dndmashup/foundry-compat';
import { Size } from '@foundryvtt-dndmashup/mashup-rules';
import { ItemDocument } from '../../item-data-types-template';
import { BaseItemTemplateDataSourceData } from '../../templates/bases';

export type RaceDataSourceData = BaseItemTemplateDataSourceData & {
	baseSpeed: number;
	size: Size;
};

export type RaceSystemData = RaceDataSourceData;
export type RaceData = TypedData<'race', RaceSystemData>;

export type RaceDocument = ItemDocument<RaceData>;
