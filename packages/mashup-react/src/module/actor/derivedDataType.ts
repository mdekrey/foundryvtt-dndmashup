import { Ability, DamageType, Defense, Size } from '../../types/types';

export type CommonDerivedDataProperties = {
	abilities: {
		[ability in Ability]: { total: number };
	};
	health: {
		hp: { max: number };
		bloodied: number;
		surgesRemaining: {
			max: number;
		};
		surgesValue: number;
	};
	defenses: {
		[defense in Defense]: number;
	};
	damageTypes: {
		[damageType in DamageType]: { resistance: number; vulnerability: number };
	};
	speed: number;
	initiative: number;
	size: Size;
	combatBonuses: {
		attackRoll: number;
		damage: number;
		savingThrow: number;
	};
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
