import { Ability, TypedData } from 'src/types/types';
import { SimpleDocument } from 'src/core/interfaces/simple-document';
import { BaseItemTemplateDataSourceData } from '../../templates/bases';

export type ClassDataSourceData = BaseItemTemplateDataSourceData & {
	role: string;
	powerSource: string;
	keyAbilities: Ability[];
	hpBase: number;
	hpPerLevel: number;
	healingSurgesBase: number;
};

export type ClassData = TypedData<'class', ClassDataSourceData>;

export type ClassDocument = SimpleDocument<ClassData>;
