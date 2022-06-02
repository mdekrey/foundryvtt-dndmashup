import { MashupItemClass } from './class/config';
import { MashupItemRace } from './race/config';
import { MashupItemBase } from '../mashup-item';
import { MashupItemFeature } from './feature/config';

export function isClass(item: MashupItemBase): item is MashupItemClass {
	return item instanceof MashupItemClass;
}
export function isRace(item: MashupItemBase): item is MashupItemRace {
	return item instanceof MashupItemRace;
}
export function isFeature(item: MashupItemBase): item is MashupItemFeature {
	return item instanceof MashupItemFeature;
}
