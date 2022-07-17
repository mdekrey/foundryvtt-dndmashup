import { Ability, Currency, TypedData } from 'src/types/types';
import { FeatureBonus } from '../bonuses';

export type AbilityScores = {
	[ability in Ability]: { base: number };
};

export type ActorDetails = {
	level: number;
	biography: string;
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
