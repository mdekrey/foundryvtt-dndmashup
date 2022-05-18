import { BaseTemplateDataSourceData, NpcDataSourceData, PlayerCharacterDataSourceData } from 'src/template.types';
import { Ability, Defense } from 'src/types/types';

export type CommonDataProperties = Merge<
	BaseTemplateDataSourceData,
	{
		abilityScores: {
			[ability in Ability]: { final: number };
		};
		health: {
			maxHp: number;
		};
		defenses: {
			[defense in Defense]: { final: number };
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

export type NpcDataProperties = Merge<NpcDataSourceData, CommonDataProperties>;

declare global {
	interface DataConfig {
		Actor: { type: 'pc'; data: PlayerCharacterDataProperties } | { type: 'npc'; data: NpcDataProperties };
	}
}
