import { Ability, Defense } from '../../types/types';

export type CommonDerivedDataProperties = {
	abilities: {
		[ability in Ability]: number;
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
	speed: number;
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
