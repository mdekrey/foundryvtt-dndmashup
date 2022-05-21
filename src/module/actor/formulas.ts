import { ActorDataBaseProperties } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import { MashupItem, SpecificItem } from '../item/mashup-item';

type Items = ActorDataBaseProperties['items'];

function isClass(item: MashupItem): item is SpecificItem<'class'> {
	return item instanceof MashupItem && item.type === 'class';
}
function isRace(item: MashupItem): item is SpecificItem<'race'> {
	return item instanceof MashupItem && item.type === 'race';
}

export function findAppliedClass(items: Items) {
	return items?.find(isClass);
}

export function findAppliedRace(items: Items) {
	return items?.find(isRace);
}

export function calculateMaxHp(data: DataConfig['Actor']['data'], items?: Items) {
	const appliedClass = items && findAppliedClass(items);

	// TODO: should use the monster role
	return 10 + (appliedClass?.data.data.hpBase ?? 0) + data.abilities.con.final * 2;
}
