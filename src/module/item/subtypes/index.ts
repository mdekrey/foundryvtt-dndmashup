import type { PossibleItemType } from '../types';
import { MashupItemClass } from './class';
import { MashupItemRace } from './race';
import { MashupItemEquipment } from './equipment/config';
import { MashupItemFeature } from './feature';
import { MashupItem } from '../mashup-item';

export const itemMappings: Record<
	PossibleItemType,
	{
		new (...args: ConstructorParameters<typeof MashupItem>): MashupItem;
		create: (...args: Parameters<typeof MashupItem['create']>) => ReturnType<typeof MashupItem['create']>;
	}
> = {
	class: MashupItemClass,
	race: MashupItemRace,
	equipment: MashupItemEquipment,
	feature: MashupItemFeature,
};
