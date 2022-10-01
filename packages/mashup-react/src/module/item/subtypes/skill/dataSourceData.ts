import { TypedData } from '@foundryvtt-dndmashup/foundry-compat';
import { ItemDocument } from '../../item-data-types-template';
import { BaseItemTemplateDataSourceData, ItemDescriptionItemTemplateDataSourceData } from '../../templates/bases';

export type SkillDataSourceData = BaseItemTemplateDataSourceData & ItemDescriptionItemTemplateDataSourceData;

export type SkillSystemData = SkillDataSourceData;

export type SkillData = TypedData<'skill', SkillSystemData>;

export type SkillDocument = ItemDocument<SkillData>;
