import { FeatureBonus } from './module/bonuses';
import { Ability, Currency } from './types/types';

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

export type BaseItemTemplateDataSourceData = {
	grantedBonuses: FeatureBonus[];
};

export type ItemDescriptionItemTemplateDataSourceData = {
	description: {
		text: string;
		// TODO: how would unidentified work?
		// unidentifiedText: string;
		// isIdentified: boolean;
	};
};

export type CarriedItemItemTemplateDataSourceData = {
	quantity: number;
	weight: number;
	price: number;
};

export type ClassDataSourceData = Merge<
	BaseItemTemplateDataSourceData,
	{
		role: string;
		powerSource: string;
		keyAbilities: Ability[];
		hpBase: number;
		hpPerLevel: number;
		healingSurgesBase: number;
	}
>;
export type RaceDataSourceData = Merge<
	BaseItemTemplateDataSourceData,
	{
		baseSpeed: number;
	}
>;
type ItemSlot = 'weapon' | 'body';
type EquippedItemSlot = 'weapon-primary' | 'weapon-off-hand' | 'body';
export type EquipmentDataSourceData = Merge<
	BaseItemTemplateDataSourceData,
	ItemDescriptionItemTemplateDataSourceData &
		CarriedItemItemTemplateDataSourceData & {
			itemSlot: ItemSlot;
			equipped: '' | EquippedItemSlot;
		}
>;

type DataSource<T extends string, TData> = { type: T; data: TData };
export type PlayerCharacterDataSource = DataSource<'pc', PlayerCharacterDataSourceData>;
export type MonsterDataSource = DataSource<'monster', MonsterDataSourceData>;
export type ClassDataSource = DataSource<'class', ClassDataSourceData>;
export type RaceDataSource = DataSource<'race', RaceDataSourceData>;
export type EquipmentDataSource = DataSource<'equipment', EquipmentDataSourceData>;

declare global {
	interface SourceConfig {
		Actor: PlayerCharacterDataSource | MonsterDataSource;
		Item: ClassDataSource | RaceDataSource | EquipmentDataSource;
	}
}
