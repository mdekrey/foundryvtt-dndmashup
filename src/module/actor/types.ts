import {
	BaseActorTemplateDataSourceData,
	MonsterDataSource,
	MonsterDataSourceData,
	PlayerCharacterDataSource,
	PlayerCharacterDataSourceData,
} from 'src/template.types';
import { Ability, Defense } from 'src/types/types';
import { ActorData } from './actor.types';

export type CommonDataProperties = Merge<
	BaseActorTemplateDataSourceData,
	{
		abilities: {
			[ability in Ability]: { final: number };
		};
		health: {
			maxHp: number;
			bloodied: number;
			surges: {
				value: number;
				max: number;
			};
		};
		defenses: {
			[defense in Defense]: number;
		};
		speed: number;
	}
>;

export type PlayerCharacterDataProperties = Merge<
	PlayerCharacterDataSourceData,
	Merge<
		CommonDataProperties,
		{
			magicItemUse: {
				usesPerDay: number;
			};
		}
	>
>;

export type MonsterDataProperties = Merge<MonsterDataSourceData, CommonDataProperties>;

export type PlayerCharacterData = { type: 'pc'; data: PlayerCharacterDataProperties };
export type MonsterData = { type: 'monster'; data: MonsterDataProperties };

declare global {
	interface DataConfig {
		Actor: PlayerCharacterData | MonsterData;
	}
}

export type PossibleActorData =
	| ActorData<PlayerCharacterData, PlayerCharacterDataSource>
	| ActorData<MonsterData, MonsterDataSource>;

export type SpecificActorData<T extends PossibleActorData['type']> = PossibleActorData & { type: T };
