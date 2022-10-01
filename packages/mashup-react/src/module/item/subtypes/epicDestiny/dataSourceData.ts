import { TypedData } from '@foundryvtt-dndmashup/foundry-compat';
import { ItemDocument } from '../../item-data-types-template';
import { BaseItemTemplateDataSourceData } from '../../templates/bases';

export type EpicDestinyDataSourceData = BaseItemTemplateDataSourceData; // TODO

export type EpicDestinySystemData = EpicDestinyDataSourceData;
export type EpicDestinyData = TypedData<'epicDestiny', EpicDestinySystemData>;

export type EpicDestinyDocument = ItemDocument<EpicDestinyData>;
