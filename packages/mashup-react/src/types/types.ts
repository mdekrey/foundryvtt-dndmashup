export const abilities = ['str', 'con', 'dex', 'int', 'wis', 'cha'] as const;
export type Ability = typeof abilities[number];

export const defenses = ['ac', 'fort', 'refl', 'will'] as const;
export type Defense = typeof defenses[number];

export const currencies = ['ad', 'pp', 'gp', 'sp', 'cp'] as const;
export type Currency = typeof currencies[number];

export const damageTypes = [
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
export type DamageType = typeof damageTypes[number];
