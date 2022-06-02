import { Abilities, Ability, Defense, Defenses } from 'src/types/types';
import { MashupActor } from '../actor/mashup-actor';
import { MashupItemBase } from '../item/mashup-item-base';
import * as ConditionRules from './conditionRules';

export const bonusTargets = [
	...Abilities.map((ability) => `ability-${ability}` as const),
	...Defenses.map((defense) => `defense-${defense}` as const),
	`maxHp` as const,
	`surges-value` as const,
	`surges-max` as const,
	`speed` as const,
	// TODO: add support for attacks, damage, saving throws
	// TODO: add conditional bonuses
];

export type AbilityBonus = `ability-${Ability}`;
export type DefenseBonus = `defense-${Defense}`;
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

export const conditionRules = ConditionRules;
export type AllConditionRules = typeof conditionRules;
export type ConditionRule = keyof AllConditionRules;
// export type ConditionRuleContext = { actor: MashupActor; item: MashupItemBase };
export type ConditionRuleContext = { actor: MashupActor; item: MashupItemBase };
