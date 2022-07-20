import { ActorDerivedData } from '@foundryvtt-dndmashup/mashup-react';
import { MashupActor } from '../mashup-actor';
import { PossibleActorData } from '../types';

export type SubActorFunctions<T extends PossibleActorData['type']> = {
	prepare: (data: ActorDerivedData<T>, actor: MashupActor) => void;
};
