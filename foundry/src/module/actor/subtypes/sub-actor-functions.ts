import { ActorDerivedData } from 'dndmashup-react/src/module/actor/derivedDataType';
import { MashupActor } from '../mashup-actor';
import { PossibleActorData } from '../types';

export type SubActorFunctions<T extends PossibleActorData['type']> = {
	prepare: (data: ActorDerivedData<T>, actor: MashupActor) => void;
};
