export type CommonDerivedDataProperties = {
	health: {
		hp: { max: number };
		surgesRemaining: {
			max: number;
		};
	};
	initiative: number;
};

export type PlayerCharacterDerivedDataProperties = CommonDerivedDataProperties;

export type MonsterDerivedDataProperties = CommonDerivedDataProperties;

interface ActorDerivedDataTemplates {
	pc: PlayerCharacterDerivedDataProperties;
	monster: MonsterDerivedDataProperties;
}

export type ActorDerivedData<T extends keyof ActorDerivedDataTemplates = keyof ActorDerivedDataTemplates> =
	ActorDerivedDataTemplates[T];
