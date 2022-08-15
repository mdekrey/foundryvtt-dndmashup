import { abilities, Ability, Defense, defenses, DamageType, damageTypes } from '../types/types';

export const numericBonusTargets = [
	...abilities.map((ability) => `ability-${ability}` as const),
	...defenses.map((defense) => `defense-${defense}` as const),
	...damageTypes.map((damageType) => `${damageType}-resistance` as const),
	...damageTypes.map((damageType) => `${damageType}-vulnerability` as const),
	`maxHp` as const,
	`surges-value` as const,
	`surges-max` as const,
	`speed` as const,
	`initiative` as const,
	`attack-roll` as const,
	`damage` as const,
	`critical-damage` as const,
	`saving-throw` as const,
	`healing` as const,
];

export type AbilityBonus = `ability-${Ability}`;
export type DefenseBonus = `defense-${Defense}`;
export type Resistance = `${DamageType}-resistance`;
export type Vulnerability = `${DamageType}-vulnerability`;
export type NumericBonusTarget = typeof numericBonusTargets[number];

export function isAbilityBonus(bonusTarget: NumericBonusTarget): bonusTarget is AbilityBonus {
	return bonusTarget.startsWith('ability-');
}
export function abilityForBonus(bonusTarget: AbilityBonus): Ability {
	return bonusTarget.substring('ability-'.length) as Ability;
}
export function isDefenseBonus(bonusTarget: NumericBonusTarget): bonusTarget is DefenseBonus {
	return bonusTarget.startsWith('defense-');
}
export function defenseForBonus(bonusTarget: DefenseBonus): Defense {
	return bonusTarget.substring('defense-'.length) as Defense;
}

export const bonusTypes = ['enhancement', 'ability', 'armor', 'class', 'feat', 'power', 'proficiency', 'shield'];
