import { TypedData } from 'src/types/types';
import { ItemDocument } from '../../item-data-types-template';
import { BaseItemTemplateDataSourceData } from '../../templates/bases';

export type ParagonPathDataSourceData = BaseItemTemplateDataSourceData; // TODO

export type ParagonPathData = TypedData<'paragonPath', ParagonPathDataSourceData>;

export type ParagonPathDocument = ItemDocument<ParagonPathData>;
