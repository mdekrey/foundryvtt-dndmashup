import { ActorDataBaseProperties } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import { ClassDataSource, RaceDataSource } from '../item/types';
import { MashupItem, SpecificItem } from '../item/mashup-item';

type Items = ActorDataBaseProperties['items'];

export function isClassSource(item: SourceConfig['Item']): item is ClassDataSource {
	return item.type === 'class';
}
export function isRaceSource(item: SourceConfig['Item']): item is RaceDataSource {
	return item.type === 'race';
}

export function isClass(item: MashupItem): item is SpecificItem<'class'> {
	return item instanceof MashupItem && isClassSource(item.data._source);
}
export function isRace(item: MashupItem): item is SpecificItem<'race'> {
	return item instanceof MashupItem && isRaceSource(item.data._source);
}

export function findAppliedClass(items: Items) {
	return items?.find(isClass);
}

export function findAppliedRace(items: Items) {
	return items?.find(isRace);
}
