import { toObject } from '@foundryvtt-dndmashup/mashup-core';
import { capitalize } from 'lodash/fp';
import { abilities, defenses, damageTypes } from '../../types/types';
import { AbilityBonus, BonusTarget, DefenseBonus, Resistance, Vulnerability } from './constants';

export const targets: Record<BonusTarget, { label: string }> = {
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
