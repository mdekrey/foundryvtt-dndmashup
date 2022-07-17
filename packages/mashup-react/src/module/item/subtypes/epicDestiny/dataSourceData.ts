import { TypedData } from 'src/types/types';
import { ItemDocument } from '../../item-data-types-template';
import { BaseItemTemplateDataSourceData } from '../../templates/bases';

export type EpicDestinyDataSourceData = BaseItemTemplateDataSourceData; // TODO

export type EpicDestinyData = TypedData<'epicDestiny', EpicDestinyDataSourceData>;

export type EpicDestinyDocument = ItemDocument<EpicDestinyData>;
