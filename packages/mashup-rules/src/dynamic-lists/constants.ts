export const dynamicLists = [
	`languagesKnown` as const,
	`proficiencies` as const,
	`implements` as const,
	`damageTypes` as const,
	`criticalDamageTypes` as const,
];
export type DynamicListTarget = typeof dynamicLists[number];
