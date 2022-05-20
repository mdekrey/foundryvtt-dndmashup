import {
	BaseActorTemplateDataSourceData,
	MonsterDataSourceData,
	PlayerCharacterDataSourceData,
} from 'src/template.types';
import { Ability, Defense } from 'src/types/types';

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

declare global {
	interface DataConfig {
		Actor:
			| { type: 'pc'; data: PlayerCharacterDataProperties }
			| { type: 'npc'; data: never }
			| { type: 'monster'; data: MonsterDataProperties };
	}
}
