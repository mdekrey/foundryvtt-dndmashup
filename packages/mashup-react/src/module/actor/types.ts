import { TypedData } from '@foundryvtt-dndmashup/foundry-compat';
import { Ability, Currency, DynamicListEntry, PoolState } from '@foundryvtt-dndmashup/mashup-rules';
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
	magicItemUse: {
		currentRemaining: number;
		usedThisEncounter: boolean;
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

export type SkillEntry = {
	name: string;
	img: string;
	ranks: number;
};

export type PcActorTemplateDataSourceData = {
	details: PcDetails;
	skills?: SkillEntry[];
};

export type MonsterActorTemplateDataSourceData = {
	details: {
		role: string;
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
