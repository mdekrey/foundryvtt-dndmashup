import { DynamicListTarget } from './constants';

export const targets: Record<DynamicListTarget, { label: string }> = {
	languagesKnown: {
		label: 'Languages Known',
	},
	proficiencies: {
		label: 'Proficiency',
	},
	implements: {
		label: 'Implement Used',
	},
	damageTypes: {
		label: 'Damage Type',
	},
};
