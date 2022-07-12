import { Ability, TypedData } from 'dndmashup-react/types/types';
import { SimpleDocument } from 'dndmashup-react/core/interfaces/simple-document';
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
