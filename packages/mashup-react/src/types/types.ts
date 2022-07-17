export const Abilities = ['str', 'con', 'dex', 'int', 'wis', 'cha'] as const;
export type Ability = typeof Abilities[number];

export const Defenses = ['ac', 'fort', 'refl', 'will'] as const;
export type Defense = typeof Defenses[number];

export const Currencies = ['ad', 'pp', 'gp', 'sp', 'cp'] as const;
export type Currency = typeof Currencies[number];

export type TypedData<T extends string, TData> = { _id: string; type: T; data: TData };

export const DamageTypes = [
	'acid',
	'cold',
	'fire',
	'force',
	'lightning',
	'necrotic',
	'poison',
	'psychic',
	'radiant',
	'thunder',
] as const;
export type DamageType = typeof DamageTypes[number];
