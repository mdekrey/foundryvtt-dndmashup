import { ActorDerivedData, PossibleActorType } from '@foundryvtt-dndmashup/mashup-react';
import { MashupActor } from '../mashup-actor';

export type SubActorFunctions<T extends PossibleActorType> = {
	prepare: (data: ActorDerivedData<T>, actor: MashupActor) => void;
};
