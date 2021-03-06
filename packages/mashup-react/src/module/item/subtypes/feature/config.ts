export type FeatureType = 'feat' | 'class-feature' | 'race-feature' | 'paragon-feature' | 'epic-feature';

export const featureTypes: Record<FeatureType, { label: string }> = {
	feat: {
		label: 'Feat',
	},
	'class-feature': {
		label: 'Class Feature',
	},
	'race-feature': {
		label: 'Racial Feature',
	},
	'paragon-feature': {
		label: 'Paragon Path Feature',
	},
	'epic-feature': {
		label: 'Epic Destiny Feature',
	},
};
