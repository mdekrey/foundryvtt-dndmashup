import type { PossibleItemData } from '../types';
import { classConfig, MashupItemClass } from './class';
import { MashupItemRace, raceConfig } from './race';
import { equipmentConfig, MashupItemEquipment } from './equipment/config';
import { SubItemFunctions } from './sub-item-functions';
import { featureConfig, MashupItemFeature } from './feature';
import { MashupItemBase } from '../mashup-item-base';

export { SubItemFunctions } from './sub-item-functions';

export const itemSubtypeConfig: {
	[K in PossibleItemData['type']]: SubItemFunctions<K>;
} = {
	class: classConfig,
	race: raceConfig,
	equipment: equipmentConfig,
	feature: featureConfig,
};

export const itemMappings: Record<
	PossibleItemData['type'],
	{
		new (...args: ConstructorParameters<typeof MashupItemBase>): MashupItemBase;
		create: (...args: Parameters<typeof MashupItemBase['create']>) => ReturnType<typeof MashupItemBase['create']>;
	}
> = {
	class: MashupItemClass,
	race: MashupItemRace,
	equipment: MashupItemEquipment,
	feature: MashupItemFeature,
};
