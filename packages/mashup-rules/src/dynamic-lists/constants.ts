export const dynamicLists = [
	`languagesKnown` as const,
	`proficiencies` as const,
	`implements` as const,
	`damageTypes` as const,
	`criticalDamageTypes` as const,
	`senses` as const,
	`origin` as const,
	`movement` as const,
];
export type DynamicListTarget = typeof dynamicLists[number];
