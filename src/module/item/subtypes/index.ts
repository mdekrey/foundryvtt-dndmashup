import type { PossibleItemType } from '../types';
import { MashupItemClass } from './class/config';
import { MashupItemRace } from './race/config';
import { MashupItemEquipment } from './equipment/config';
import { MashupItemFeature } from './feature/config';
import { MashupParagonPath } from './paragonPath/config';
import { MashupEpicDestiny } from './epicDestiny/config';
import { MashupPower } from './power/config';

export * from './filters';

export const itemMappings = {
	class: MashupItemClass,
	race: MashupItemRace,
	equipment: MashupItemEquipment,
	feature: MashupItemFeature,
	paragonPath: MashupParagonPath,
	epicDestiny: MashupEpicDestiny,
	power: MashupPower,
};

// If there is an error on the following line, not all types are mapped above
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const typeCheck: PossibleItemType extends keyof typeof itemMappings ? true : false = true;
