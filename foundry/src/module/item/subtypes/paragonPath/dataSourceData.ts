import { SimpleDocument } from 'src/core/interfaces/simple-document';
import { TypedData } from 'dndmashup-react/types/types';
import { BaseItemTemplateDataSourceData } from '../../templates/bases';

export type ParagonPathDataSourceData = BaseItemTemplateDataSourceData; // TODO

export type ParagonPathData = TypedData<'paragonPath', ParagonPathDataSourceData>;

export type ParagonPathDocument = SimpleDocument<ParagonPathData>;
