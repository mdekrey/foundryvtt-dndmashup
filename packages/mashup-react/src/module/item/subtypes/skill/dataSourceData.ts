import { TypedData } from '@foundryvtt-dndmashup/foundry-compat';
import { ItemDocument } from '../../item-data-types-template';
import { BaseItemTemplateDataSourceData, ItemDescriptionItemTemplateDataSourceData } from '../../templates/bases';

export type SkillDataSourceData = BaseItemTemplateDataSourceData & ItemDescriptionItemTemplateDataSourceData;

export type SkillData = TypedData<'skill', SkillDataSourceData>;

export type SkillDocument = ItemDocument<SkillData>;
