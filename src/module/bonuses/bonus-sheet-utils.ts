import { BonusTarget, ConditionRule } from './constants';

export const targets: Record<BonusTarget, { label: string }> = {
	'ability-str': { label: 'STR' },
	'ability-con': { label: 'CON' },
	'ability-dex': { label: 'DEX' },
	'ability-int': { label: 'INT' },
	'ability-wis': { label: 'WIS' },
	'ability-cha': { label: 'CHA' },
	'defense-ac': { label: 'AC' },
	'defense-fort': { label: 'FORT' },
	'defense-refl': { label: 'REFL' },
	'defense-will': { label: 'WILL' },
	'surges-max': { label: 'Surges per Day' },
	'surges-value': { label: 'HP per Surge' },
	maxHp: { label: 'Maximum HP' },
	speed: { label: 'Speed' },
};

export const conditions: Record<ConditionRule | '', { label: string; display: string }> = {
	'': { label: '(always)', display: '' },
	proficientIn: { label: 'When you are proficient with the item', display: 'when you are proficient with the item' },
	bloodied: { label: 'When you are bloodied', display: 'when you are bloodied' },
};
