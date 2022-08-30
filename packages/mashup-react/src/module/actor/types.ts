import { TypedData } from '@foundryvtt-dndmashup/foundry-compat';
import {
	Ability,
	Currency,
	Defense,
	DynamicListEntry,
	MonsterPowerLevel,
	PoolState,
	Size,
} from '@foundryvtt-dndmashup/mashup-rules';
import { FeatureBonus } from '@foundryvtt-dndmashup/mashup-rules';

export type AbilityScores = {
	[ability in Ability]: { base: number };
};

export type ActorDetails = {
	level: number;
	biography: string;
};

export type Health = {
	hp: { value: number };
	temporaryHp: number;
	secondWindUsed: boolean;
	deathSavesRemaining: number;
	surgesRemaining: {
		value: number;
	};
};

export type ActionPoints = {
	value: number;
	usedThisEncounter: boolean;
};

export type BaseActorTemplateDataSourceData = {
	bonuses: FeatureBonus[];
	dynamicList: DynamicListEntry[];
	details: ActorDetails;
	abilities: AbilityScores;
	health: Health;
	actionPoints: ActionPoints;
	encountersSinceLongRest: number;
	magicItemUse: {
		used: number;
	};
	senses: {
		vision: { value: string[] };
		special: { value: string[] };
		notes: string;
	};
	currency: {
		[currency in Currency]: number;
	};
	pools: PoolState[];
	powerUsage?: Record<string, number>;
};

export type PcDetails = ActorDetails & {
	exp: number;
	age: string;
	pronouns: string;
	height: string;
	width: string;
	deity: string;
	adventuringCompany: string;
};

export type SkillEntry = {
	name: string;
	img: string;
	ranks: number;
};

export type PcActorTemplateDataSourceData = {
	details: PcDetails;
	skills?: SkillEntry[];
};

export type MonsterDetails = ActorDetails & {
	origin: string;
	type: string;
	keywords: string[];
	power: MonsterPowerLevel;
	role: string;
	leader: boolean;
};

export type MonsterHealth = {
	hp: { maxBase: number };
};

export type MonsterActorTemplateDataSourceData = {
	details: MonsterDetails;
	size: Size;
	initiativeBase: number;
	speedBase: number;
	health: MonsterHealth;
	baseDefenses: {
		[defense in Defense]: number;
	};
};

export type PlayerCharacterDataSourceData = BaseActorTemplateDataSourceData & PcActorTemplateDataSourceData;
export type MonsterDataSourceData = BaseActorTemplateDataSourceData & MonsterActorTemplateDataSourceData;

export type PlayerCharacterDataSource = TypedData<'pc', PlayerCharacterDataSourceData>;
export type MonsterDataSource = TypedData<'monster', MonsterDataSourceData>;

export interface PossibleActorTypeTemplates {
	pc: PlayerCharacterDataSource;
	monster: MonsterDataSource;
}
export type PossibleActorType = keyof PossibleActorTypeTemplates;
export type ActorDataSource<T extends PossibleActorType = PossibleActorType> = PossibleActorTypeTemplates[T];
