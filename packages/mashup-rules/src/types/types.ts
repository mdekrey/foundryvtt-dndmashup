export const abilities = ['str', 'con', 'dex', 'int', 'wis', 'cha'] as const;
export type Ability = typeof abilities[number];

export const defenses = ['ac', 'fort', 'refl', 'will'] as const;
export type Defense = typeof defenses[number];

export const currencies = ['cp', 'sp', 'gp', 'pp', 'ad'] as const;
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

export const sizes = ['tiny', 'small', 'medium', 'large', 'huge', 'gargantuan'] as const;
export type Size = typeof sizes[number];
export const sizeToTokenSize: Record<Size, number> = {
	tiny: 1,
	small: 1,
	medium: 1,
	large: 2,
	huge: 3,
	gargantuan: 4,
};
