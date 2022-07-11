import { MashupActor } from '../mashup-actor';
import { PossibleActorData, ActorDerivedData } from '../types';

export type SubActorFunctions<T extends PossibleActorData['type']> = {
	prepare: (data: ActorDerivedData<T>, actor: MashupActor) => void;
};
