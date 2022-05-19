import { Ability, Currency } from './types/types';

export type BaseTemplateDataSourceData = {
	details: {
		level: number;
	};
	abilityScores: {
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

export type PcTemplateDataSourceData = {
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

export type MonsterTemplateDataSourceData = {
	details: {
		role: string;
	};
};

export type PlayerCharacterDataSourceData = Merge<BaseTemplateDataSourceData, PcTemplateDataSourceData>;
export type MonsterDataSourceData = Merge<BaseTemplateDataSourceData, MonsterTemplateDataSourceData>;

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
	}
}
