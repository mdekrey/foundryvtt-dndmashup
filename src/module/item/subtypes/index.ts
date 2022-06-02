import type { PossibleItemType } from '../types';
import { MashupItemClass } from './class/config';
import { MashupItemRace } from './race/config';
import { MashupItemEquipment } from './equipment/config';
import { MashupItemFeature } from './feature/config';

export const itemMappings = {
	class: MashupItemClass,
	race: MashupItemRace,
	equipment: MashupItemEquipment,
	feature: MashupItemFeature,
};

// If there is an error on the following line, not all types are mapped above
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const typeCheck: PossibleItemType extends keyof typeof itemMappings ? true : false = true;
