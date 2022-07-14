import { PlayerCharacterDataSource, MonsterDataSource, ActorDataSource } from 'dndmashup-react/module/actor/types';
import { ActorData } from './actor.types';

declare global {
	interface SourceConfig {
		Actor: ActorDataSource;
	}
	interface DataConfig {
		Actor: ActorDataSource;
	}
}

export type PossibleActorData =
	| ActorData<PlayerCharacterDataSource, PlayerCharacterDataSource>
	| ActorData<MonsterDataSource, MonsterDataSource>;

export type SpecificActorData<T extends PossibleActorData['type']> = PossibleActorData & { type: T };
