import { toObject } from '@foundryvtt-dndmashup/core';
import { capitalize } from 'lodash/fp';
import { abilities, defenses, damageTypes } from '../types/types';
import { AbilityBonus, NumericBonusTarget, DefenseBonus, Resistance, Vulnerability } from './constants';

export const numericBonusTargetNames: Record<NumericBonusTarget, { label: string }> = {
	...toObject(
		abilities,
		(abil): AbilityBonus => `ability-${abil}`,
		(abil) => ({ label: abil.toLocaleUpperCase() })
	),
	...toObject(
		defenses,
		(def): DefenseBonus => `defense-${def}`,
		(def) => ({ label: def.toLocaleUpperCase() })
	),
	'surges-max': { label: 'Surges per Day' },
	'surges-value': { label: 'HP per Surge' },
	maxHp: { label: 'Maximum HP' },
	speed: { label: 'Speed' },
	initiative: { label: 'Initiative' },
	'attack-roll': { label: 'Attack Roll' },
	damage: { label: 'Damage' },
	'critical-damage': { label: 'Critical Damage' },
	healing: { label: 'Healing' },
	'saving-throw': { label: 'Saving Throws' },

	...toObject(
		damageTypes,
		(dmg): Resistance => `${dmg}-resistance`,
		(dmg) => ({ label: `${capitalize(dmg)} Resistance` })
	),
	...toObject(
		damageTypes,
		(dmg): Vulnerability => `${dmg}-vulnerability`,
		(dmg) => ({ label: `${capitalize(dmg)} Vulnerability` })
	),
};
