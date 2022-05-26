import { Ability, Currency, DataSource, Defense } from 'src/types/types';
import { ActorData } from './actor.types';
import { FeatureBonus } from '../bonuses';

export type BaseActorTemplateDataSourceData = {
	bonuses: FeatureBonus[];
	details: {
		level: number;
	};
	abilities: {
		[ability in Ability]: { base: number };
	};
	health: {
		currentHp: number;
		temporaryHp: number;
		secondWindUsed: boolean;
		deathSavesRemaining: number;
		surges: {
			remaining: number;
		};
		surgesRemaining: number;
	};
	actionPoints: {
		value: number;
		usedThisEncounter: boolean;
	};
	magicItemUse: {
		currentRemaining: number;
		usedThisEncounter: boolean;
	};
	languages: {
		spoken: { value: string[] };
		script: { value: string[] };
	};
	senses: {
		vision: { value: string[] };
		special: { value: string[] };
		notes: string;
	};
	currency: {
		[currency in Currency]: number;
	};
};

export type PcActorTemplateDataSourceData = {
	details: {
		exp: number;
		size: string;
		age: string;
		pronouns: string;
		height: string;
		width: string;
		deity: string;
		adventuringCompany: string;
	};
};

export type MonsterActorTemplateDataSourceData = {
	details: {
		role: string;
	};
};

export type PlayerCharacterDataSourceData = Merge<BaseActorTemplateDataSourceData, PcActorTemplateDataSourceData>;
export type MonsterDataSourceData = Merge<BaseActorTemplateDataSourceData, MonsterActorTemplateDataSourceData>;

export type PlayerCharacterDataSource = DataSource<'pc', PlayerCharacterDataSourceData>;
export type MonsterDataSource = DataSource<'monster', MonsterDataSourceData>;

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
	interface SourceConfig {
		Actor: PlayerCharacterDataSource | MonsterDataSource;
	}
	interface DataConfig {
		Actor: PlayerCharacterData | MonsterData;
	}
}

export type PossibleActorData =
	| ActorData<PlayerCharacterData, PlayerCharacterDataSource>
	| ActorData<MonsterData, MonsterDataSource>;

export type SpecificActorData<T extends PossibleActorData['type']> = PossibleActorData & { type: T };
