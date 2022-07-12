import { SimpleDocument } from 'dndmashup-react/core/interfaces/simple-document';
import { TypedData } from 'dndmashup-react/types/types';
import { BaseItemTemplateDataSourceData } from '../../templates/bases';

export type EpicDestinyDataSourceData = BaseItemTemplateDataSourceData; // TODO

export type EpicDestinyData = TypedData<'epicDestiny', EpicDestinyDataSourceData>;

export type EpicDestinyDocument = SimpleDocument<EpicDestinyData>;
