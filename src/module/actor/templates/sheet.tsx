import { SpecificActor } from '../mashup-actor';
import { MashupActorSheet } from '../mashup-actor-sheet';
import { PossibleActorData } from '../types';
import { PcSheet } from './pcSheet';

function isActorType<T extends PossibleActorData['type']>(actor: SpecificActor, type: T): actor is SpecificActor<T> {
	return actor.data.type === type;
}

export function ActorSheetJsxDemo({ sheet }: { sheet: MashupActorSheet }) {
	const actor = sheet.actor as SpecificActor;

	return isActorType(actor, 'pc') ? <PcSheet actor={actor} /> : null;
}
