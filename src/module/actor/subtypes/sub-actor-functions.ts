import { MashupActor } from '../mashup-actor';
import { PossibleActorData, SpecificActorData } from '../types';

export type SubActorFunctions<T extends PossibleActorData['type']> = {
	prepare: (data: SpecificActorData<T>, actor: MashupActor) => void;
};
