import type { PossibleItemData } from '../types';
import { classConfig } from './class';
import { raceConfig } from './race';
import { equipmentConfig } from './equipment/config';
import { SubItemFunctions } from './sub-item-functions';

export { SubItemFunctions } from './sub-item-functions';

export const itemSubtypeConfig: {
	[K in PossibleItemData['type']]: SubItemFunctions<K>;
} = {
	class: classConfig,
	race: raceConfig,
	equipment: equipmentConfig,
};
