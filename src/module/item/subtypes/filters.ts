import { MashupItemClass } from './class/config';
import { MashupItemRace } from './race/config';
import { MashupItemBase } from '../mashup-item';
import { MashupParagonPath } from './paragonPath/config';
import { MashupEpicDestiny } from './epicDestiny/config';
import { MashupItemFeature } from './feature/config';
import { MashupPower } from './power/config';

export function isClass(item: MashupItemBase): item is MashupItemClass {
	return item instanceof MashupItemClass;
}
export function isRace(item: MashupItemBase): item is MashupItemRace {
	return item instanceof MashupItemRace;
}
export function isParagonPath(item: MashupItemBase): item is MashupParagonPath {
	return item instanceof MashupParagonPath;
}
export function isEpicDestiny(item: MashupItemBase): item is MashupEpicDestiny {
	return item instanceof MashupEpicDestiny;
}
export function isFeature(item: MashupItemBase): item is MashupItemFeature {
	return item instanceof MashupItemFeature;
}
export function isPower(item: MashupItemBase): item is MashupPower {
	return item instanceof MashupPower;
}
