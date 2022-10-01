import { ActorDataSource, PossibleActorType } from '@foundryvtt-dndmashup/mashup-react';

declare global {
	interface SourceConfig {
		Actor: ActorDataSource;
	}
	interface DataConfig {
		Actor: ActorDataSource;
	}
}

export type PossibleActorDataSource = ActorDataSource<'pc'> | ActorDataSource<'monster'>;

export type SpecificActorDataSource<T extends PossibleActorType> = ActorDataSource<T>;
