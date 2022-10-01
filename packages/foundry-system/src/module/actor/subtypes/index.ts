import { PossibleActorType } from '@foundryvtt-dndmashup/mashup-react';
import { SubActorFunctions } from './sub-actor-functions';
import { pcConfig as pc } from './pc';
import { monsterConfig as monster } from './monster';

export type { SubActorFunctions } from './sub-actor-functions';

export const actorSubtypeConfig: {
	[K in PossibleActorType]: SubActorFunctions<K>;
} = {
	pc,
	monster,
};
