export const Abilities = ['str', 'con', 'dex', 'int', 'wis', 'cha'] as const;
export type Ability = typeof Abilities[number];

export const Defenses = ['ac', 'fort', 'refl', 'will'] as const;
export type Defense = typeof Defenses[number];

export const Currencies = ['ad', 'pp', 'gp', 'sp', 'cp'] as const;
export type Currency = typeof Currencies[number];

export type DataSource<T extends string, TData> = { type: T; data: TData };
