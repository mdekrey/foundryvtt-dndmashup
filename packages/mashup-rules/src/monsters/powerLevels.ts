export const powerLevels = [
	{ label: 'Minion', blockDisplay: 'minion', key: 'minion' },
	{ label: 'Standard', blockDisplay: '', key: 'standard' },
	{ label: 'Elite', blockDisplay: 'elite', key: 'elite' },
	{ label: 'Solo', blockDisplay: 'solo', key: 'solo' },
] as const;

export type MonsterPowerLevel = typeof powerLevels[number]['key'];
