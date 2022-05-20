import { Ability, Currency } from './types/types';

export type BaseActorTemplateDataSourceData = {
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
		tier: number;
		exp: number;
		class: string;
		paragon: string;
		epic: string;
		race: string;
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

export type BaseItemTemplateDataSourceData = {
	/* TODO */
};

export type ClassDataSourceData = BaseItemTemplateDataSourceData;
export type RaceDataSourceData = BaseItemTemplateDataSourceData;

declare global {
	interface SourceConfig {
		Actor:
			| {
					type: 'pc';
					data: PlayerCharacterDataSourceData;
			  }
			| {
					type: 'monster';
					data: MonsterDataSourceData;
			  };
		Item: { type: 'class'; data: ClassDataSourceData } | { type: 'race'; data: RaceDataSourceData };
	}
}
