import { Ability, Currency, TypedData, Defense } from 'src/types/types';
import { ActorData } from './actor.types';
import { FeatureBonus } from '../bonuses';

export type ActorDetails = {
	level: number;
	biography: string;
};

export type AbilityScores = {
	[ability in Ability]: { base: number };
};

export type Health = {
	currentHp: number;
	temporaryHp: number;
	secondWindUsed: boolean;
	deathSavesRemaining: number;
	surges: {
		remaining: number;
	};
	surgesRemaining: number;
};

export type ActionPoints = {
	value: number;
	usedThisEncounter: boolean;
};

export type BaseActorTemplateDataSourceData = {
	bonuses: FeatureBonus[];
	details: ActorDetails;
	abilities: AbilityScores;
	health: Health;
	actionPoints: ActionPoints;
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

export type PcDetails = ActorDetails & {
	exp: number;
	size: string;
	age: string;
	pronouns: string;
	height: string;
	width: string;
	deity: string;
	adventuringCompany: string;
};

export type PcActorTemplateDataSourceData = {
	details: PcDetails;
};

export type MonsterActorTemplateDataSourceData = {
	details: {
		role: string;
	};
};

export type PlayerCharacterDataSourceData = Merge<BaseActorTemplateDataSourceData, PcActorTemplateDataSourceData>;
export type MonsterDataSourceData = Merge<BaseActorTemplateDataSourceData, MonsterActorTemplateDataSourceData>;

export type PlayerCharacterDataSource = TypedData<'pc', PlayerCharacterDataSourceData>;
export type MonsterDataSource = TypedData<'monster', MonsterDataSourceData>;

export type CommonDerivedDataProperties = {
	abilities: {
		[ability in Ability]: number;
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
};

export type PlayerCharacterDerivedDataProperties = CommonDerivedDataProperties & {
	magicItemUse: {
		usesPerDay: number;
	};
};

export type MonsterDerivedDataProperties = CommonDerivedDataProperties;

interface ActorDerivedDataTemplates {
	pc: PlayerCharacterDerivedDataProperties;
	monster: MonsterDerivedDataProperties;
}

export type ActorDerivedData<T extends keyof ActorDerivedDataTemplates = keyof ActorDerivedDataTemplates> =
	ActorDerivedDataTemplates[T];

export interface PossibleActorTypeTemplates {
	pc: PlayerCharacterDataSource;
	monster: MonsterDataSource;
}
export type PossibleActorType = keyof PossibleActorTypeTemplates;
export type ActorDataSource<T extends PossibleActorType = PossibleActorType> = PossibleActorTypeTemplates[T];

declare global {
	interface SourceConfig {
		Actor: PlayerCharacterDataSource | MonsterDataSource;
	}
	interface DataConfig {
		Actor: PlayerCharacterDataSource | MonsterDataSource;
	}
}

export type PossibleActorData =
	| ActorData<PlayerCharacterDataSource, PlayerCharacterDataSource>
	| ActorData<MonsterDataSource, MonsterDataSource>;

export type SpecificActorData<T extends PossibleActorData['type']> = PossibleActorData & { type: T };
