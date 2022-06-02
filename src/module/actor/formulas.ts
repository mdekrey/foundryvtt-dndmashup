import { ActorDataBaseProperties } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import { ClassData, RaceData } from '../item/types';
import { MashupItemClass } from '../item/subtypes/class';
import { MashupItemRace } from '../item/subtypes/race';
import { MashupItemBase } from '../item/mashup-item';

type Items = ActorDataBaseProperties['items'];

export function isClassSource(item: SourceConfig['Item']): item is ClassData {
	return item.type === 'class';
}
export function isRaceSource(item: SourceConfig['Item']): item is RaceData {
	return item.type === 'race';
}

export function isClass(item: MashupItemBase): item is MashupItemClass {
	return item instanceof MashupItemClass;
}
export function isRace(item: MashupItemBase): item is MashupItemRace {
	return item instanceof MashupItemRace;
}

export function findAppliedClass(items: Items) {
	return items?.find(isClass);
}

export function findAppliedRace(items: Items) {
	return items?.find(isRace);
}
