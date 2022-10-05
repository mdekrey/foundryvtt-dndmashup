import { TypedData } from '@foundryvtt-dndmashup/foundry-compat';
import { ItemDocument } from '../../item-data-types-template';
import { BaseItemTemplateDataSourceData } from '../../templates/bases';

export type ParagonPathDataSourceData = BaseItemTemplateDataSourceData; // TODO

export type ParagonPathSystemData = ParagonPathDataSourceData;

export type ParagonPathData = TypedData<'paragonPath', ParagonPathSystemData>;

export type ParagonPathDocument = ItemDocument<ParagonPathData>;
