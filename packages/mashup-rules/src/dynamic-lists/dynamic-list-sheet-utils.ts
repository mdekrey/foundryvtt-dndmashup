import { DynamicListTarget } from './constants';

export const dynamicListTargetNames: Record<DynamicListTarget, { label: string }> = {
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
	criticalDamageTypes: {
		label: 'Critical Damage Type',
	},
};
