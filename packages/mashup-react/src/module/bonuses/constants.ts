import { abilities, Ability, Defense, defenses, DamageType, damageTypes } from '../../types/types';
import { ActorDocument } from '../actor/documentType';
import { ItemDocument } from '../item';

export const bonusTargets = [
	...abilities.map((ability) => `ability-${ability}` as const),
	...defenses.map((defense) => `defense-${defense}` as const),
	...damageTypes.map((damageType) => `${damageType}-resistance` as const),
	...damageTypes.map((damageType) => `${damageType}-vulnerability` as const),
	`maxHp` as const,
	`surges-value` as const,
	`surges-max` as const,
	`speed` as const,
	`initiative` as const,
	// TODO: add support for attacks, damage, saving throws
];

export type AbilityBonus = `ability-${Ability}`;
export type DefenseBonus = `defense-${Defense}`;
export type Resistance = `${DamageType}-resistance`;
export type Vulnerability = `${DamageType}-vulnerability`;
export type BonusTarget = typeof bonusTargets[number];

export function isAbilityBonus(bonusTarget: BonusTarget): bonusTarget is AbilityBonus {
	return bonusTarget.startsWith('ability-');
}
export function abilityForBonus(bonusTarget: AbilityBonus): Ability {
	return bonusTarget.substring('ability-'.length) as Ability;
}
export function isDefenseBonus(bonusTarget: BonusTarget): bonusTarget is DefenseBonus {
	return bonusTarget.startsWith('defense-');
}
export function defenseForBonus(bonusTarget: DefenseBonus): Defense {
	return bonusTarget.substring('defense-'.length) as Defense;
}

export const bonusTypes = ['enhancement', 'ability', 'armor', 'class', 'feat', 'power', 'proficiency', 'shield'];

export type ConditionRuleType = keyof ConditionRules;
export type ConditionRule = {
	rule: ConditionRuleType;
	parameter: Record<string, string>;
};
export type ConditionRuleContext = {
	actor: ActorDocument;
	item: ItemDocument;
};
export type ConditionRuleFunction = {
	label: string;
	display: string;
	rule: (input: ConditionRuleContext) => boolean;
};
