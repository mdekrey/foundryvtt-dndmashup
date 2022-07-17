import { PossibleActorData } from '../types';
import { SubActorFunctions } from './sub-actor-functions';
import { pcConfig as pc } from './pc';
import { monsterConfig as monster } from './monster';

export { SubActorFunctions } from './sub-actor-functions';

export const actorSubtypeConfig: {
	[K in PossibleActorData['type']]: SubActorFunctions<K>;
} = {
	pc,
	monster,
};
