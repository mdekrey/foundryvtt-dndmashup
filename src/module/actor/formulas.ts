import { ClassData, RaceData, ParagonPathData, EpicDestinyData } from '../item/types';

export function isClassSource(item: SourceConfig['Item']): item is ClassData {
	return item.type === 'class';
}
export function isRaceSource(item: SourceConfig['Item']): item is RaceData {
	return item.type === 'race';
}
export function isParagonPathSource(item: SourceConfig['Item']): item is ParagonPathData {
	return item.type === 'paragonPath';
}
export function isEpicDestinySource(item: SourceConfig['Item']): item is EpicDestinyData {
	return item.type === 'epicDestiny';
}
