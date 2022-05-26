import { FeatureBonus } from '../bonuses';
import { Ability, Currency, DataSource } from '../../types/types';

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

declare global {
	interface SourceConfig {
		Actor: PlayerCharacterDataSource | MonsterDataSource;
	}
}
