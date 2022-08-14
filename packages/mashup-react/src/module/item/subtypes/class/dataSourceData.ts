import { TypedData } from '@foundryvtt-dndmashup/foundry-compat';
import { Ability } from '@foundryvtt-dndmashup/mashup-rules';
import { BaseItemTemplateDataSourceData } from '../../templates/bases';
import { ItemDocument } from '../../item-data-types-template';

export type ClassDataSourceData = BaseItemTemplateDataSourceData & {
	role: string;
	powerSource: string;
	keyAbilities: Ability[];
	hpBase: number;
	hpPerLevel: number;
	healingSurgesBase: number;
};

export type ClassData = TypedData<'class', ClassDataSourceData>;

export type ClassDocument = ItemDocument<ClassData>;
