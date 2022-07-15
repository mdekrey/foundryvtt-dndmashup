import { ClassData } from 'dndmashup-react/src/module/item/subtypes/class/dataSourceData';
import { EpicDestinyData } from 'dndmashup-react/src/module/item/subtypes/epicDestiny/dataSourceData';
import { ParagonPathData } from 'dndmashup-react/src/module/item/subtypes/paragonPath/dataSourceData';
import { RaceData } from 'dndmashup-react/src/module/item/subtypes/race/dataSourceData';

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
