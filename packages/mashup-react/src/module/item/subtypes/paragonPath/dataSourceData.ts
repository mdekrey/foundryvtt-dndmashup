import { TypedData } from '@foundryvtt-dndmashup/foundry-compat';
import { ItemDocument } from '../../item-data-types-template';
import { BaseItemTemplateDataSourceData } from '../../templates/bases';

export type ParagonPathDataSourceData = BaseItemTemplateDataSourceData; // TODO

export type ParagonPathData = TypedData<'paragonPath', ParagonPathDataSourceData>;

export type ParagonPathDocument = ItemDocument<ParagonPathData>;
