import { BonusTarget, ConditionRule } from './constants';

export const targets: Record<BonusTarget, string> = {
	'ability-str': 'STR',
	'ability-con': 'CON',
	'ability-dex': 'DEX',
	'ability-int': 'INT',
	'ability-wis': 'WIS',
	'ability-cha': 'CHA',
	'defense-ac': 'AC',
	'defense-fort': 'FORT',
	'defense-refl': 'REFL',
	'defense-will': 'WILL',
	'surges-max': 'Surges per Day',
	'surges-value': 'HP per Surge',
	maxHp: 'Maximum HP',
	speed: 'Speed',
};

export const conditions: Record<ConditionRule, string> = {
	proficientIn: 'When you are proficient with the item',
	bloodied: 'When you are bloodied',
};
