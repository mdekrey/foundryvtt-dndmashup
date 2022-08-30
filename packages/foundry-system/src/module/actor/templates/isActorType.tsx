import { SpecificActor } from '../mashup-actor';
import { PossibleActorData } from '../types';

export function isActorType<T extends PossibleActorData['type']>(
	actor: SpecificActor,
	type: T
): actor is SpecificActor<T> {
	return actor.data.type === type;
}
