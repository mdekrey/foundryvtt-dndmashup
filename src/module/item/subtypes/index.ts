import type { PossibleItemData } from '../types';
import { MashupItemClass } from './class';
import { MashupItemRace } from './race';
import { MashupItemEquipment } from './equipment/config';
import { MashupItemFeature } from './feature';
import { MashupItemBase } from '../mashup-item-base';

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
