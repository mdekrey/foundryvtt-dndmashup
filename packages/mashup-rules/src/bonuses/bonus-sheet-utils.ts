import { toObject } from '@foundryvtt-dndmashup/core';
import { capitalize } from 'lodash/fp';
import { abilities, defenses, damageTypes } from '../types/types';
import { AbilityBonus, NumericBonusTarget, DefenseBonus, Resistance, Vulnerability } from './constants';

export const numericBonusTargetNames: Record<NumericBonusTarget, { label: string; ruleText: string }> = {
	...toObject(
		abilities,
		(abil): AbilityBonus => `ability-${abil}`,
		(abil) => ({ label: abil.toLocaleUpperCase(), ruleText: abil.toLocaleUpperCase() })
	),
	...toObject(
		defenses,
		(def): DefenseBonus => `defense-${def}`,
		(def) => ({ label: def.toLocaleUpperCase(), ruleText: def.toLocaleUpperCase() })
	),
	'surges-max': { label: 'Surges per Day', ruleText: 'healing surges per day' },
	'surges-value': { label: 'HP per Surge', ruleText: 'healing surge value' },
	maxHp: { label: 'Maximum HP', ruleText: 'maximum hit points' },
	speed: { label: 'Speed', ruleText: 'their speed' },
	initiative: { label: 'Initiative', ruleText: 'Initiative' },
	'attack-roll': { label: 'Attack Roll', ruleText: 'attackRolls' },
	damage: { label: 'Damage', ruleText: 'damage rolls' },
	'critical-damage': { label: 'Critical Damage', ruleText: 'damage rolls for critical hits' },
	healing: { label: 'Healing', ruleText: 'healing' },
	'saving-throw': { label: 'Saving Throws', ruleText: 'saving throws' },
	check: { label: 'Skill or Ability Check', ruleText: 'ability checks' },
	'magic-item-uses': { label: 'Magic Item Daily Power Uses', ruleText: 'magic item daily uses' },

	...toObject(
		damageTypes,
		(dmg): Resistance => `${dmg}-resistance`,
		(dmg) => ({ label: `${capitalize(dmg)} Resistance`, ruleText: `${dmg} resistance` })
	),
	...toObject(
		damageTypes,
		(dmg): Vulnerability => `${dmg}-vulnerability`,
		(dmg) => ({ label: `${capitalize(dmg)} Vulnerability`, ruleText: `${dmg} vulnerability` })
	),
};
