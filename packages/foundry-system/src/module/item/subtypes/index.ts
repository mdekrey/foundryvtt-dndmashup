import type { PossibleItemType } from '../types';
import { MashupItemClass } from './class/class';
import { MashupItemRace } from './race/class';
import { MashupItemEquipment } from './equipment/class';
import { MashupItemFeature } from './feature/class';
import { MashupParagonPath } from './paragonPath/class';
import { MashupEpicDestiny } from './epicDestiny/class';
import { MashupPower } from './power/class';

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
