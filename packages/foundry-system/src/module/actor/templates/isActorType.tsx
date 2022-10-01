import { PossibleActorType } from '@foundryvtt-dndmashup/mashup-react';
import { SpecificActor } from '../mashup-actor';

export function isActorType<T extends PossibleActorType>(actor: SpecificActor, type: T): actor is SpecificActor<T> {
	return actor.data.type === type;
}
