import capitalize from 'lodash/fp/capitalize';
import { SimpleDocumentData } from '@foundryvtt-dndmashup/foundry-compat';
import { Lens } from '@foundryvtt-dndmashup/mashup-core';
import { PowerData, PowerEffect } from '../dataSourceData';

export const isNull = (e: any): e is null => e === null;

export const baseLens = Lens.identity<SimpleDocumentData<PowerData>>();

const undefinedString = Lens.from<string | undefined, string>(
	(d) => d ?? '',
	(mutator) => (d) => mutator(d ?? '') || undefined
);

export const imageLens = baseLens.toField('img');
export const nameLens = baseLens.toField('name');
export const powerSourceDataLens = baseLens.toField('data');
export const sourceIdLens = powerSourceDataLens.toField('sourceId');
export const powerTypeLens = powerSourceDataLens.toField('type');
export const powerFlavorTextLens = powerSourceDataLens.toField('flavorText');
export const powerUsageLens = powerSourceDataLens.toField('usage');
export const powerActionTypeLens = powerSourceDataLens.toField('actionType');
export const powerRequirementLens = powerSourceDataLens.toField('requirement').combine(undefinedString);
export const powerPrerequisiteLens = powerSourceDataLens.toField('prerequisite').combine(undefinedString);
export const effectsLens = powerSourceDataLens.toField('effects');
export const firstEffectLens = effectsLens.toField(0).default({
	name: '',
	note: '',
	noteLabel: '',
	target: 'One creature',
	typeAndRange: { type: 'melee', range: 'weapon' },
	attackRoll: null,
	hit: { text: '', healing: null, damage: null },
	miss: null,
});
const defaultNewEffect: PowerEffect = Object.freeze({
	name: '',
	note: '',
	noteLabel: '',
	target: '',
	typeAndRange: { type: 'within', size: 'sight' },
	attackRoll: null,
	hit: { text: '', healing: null, damage: null },
	miss: null,
});
export const newEffectLens = Lens.from<PowerEffect[], PowerEffect>(
	() => defaultNewEffect,
	(mutator) => (data) => {
		data[data.length] = mutator(data[data.length]);
	}
).default(defaultNewEffect);

export const keywordsLens = Lens.from<SimpleDocumentData<PowerData>, string>(
	(power) => power.data.keywords.map(capitalize).join(', '),
	(mutator) => (draft) => {
		const keywords = mutator(draft.data.keywords.map(capitalize).join(', '));
		draft.data.keywords = keywords
			.split(',')
			.map((k) => k.toLowerCase().trim())
			.filter((v) => v.length > 0);
	}
);
