import { SimpleDocumentData } from '@foundryvtt-dndmashup/foundry-compat';
import { keywordsAsStringLens, Lens } from '@foundryvtt-dndmashup/core';
import { PowerData, PowerEffect } from '../dataSourceData';
import { activeEffectTemplateDefaultLens } from '@foundryvtt-dndmashup/mashup-rules';

export const isNull = (e: any): e is null => e === null;

export const baseLens = Lens.identity<SimpleDocumentData<PowerData>>();

const undefinedString = Lens.from<string | undefined | null, string>(
	(d) => d ?? '',
	(mutator) => (d) => mutator(d ?? '') || null
);

export const imageLens = baseLens.toField('img');
export const nameLens = baseLens.toField('name');
export const powerSourceDataLens = baseLens.toField('data');
export const sourceIdLens = powerSourceDataLens.toField('sourceId');
export const powerTypeLens = powerSourceDataLens.toField('type');
export const powerFlavorTextLens = powerSourceDataLens.toField('flavorText');
export const powerSpecialTextLens = powerSourceDataLens.toField('special');
export const isBasicAttackLens = powerSourceDataLens.toField('isBasic');
export const selfAppliedTemplateLens = powerSourceDataLens
	.toField('selfApplied')
	.combine(activeEffectTemplateDefaultLens);
export const powerUsageLens = powerSourceDataLens.toField('usage');
export const powerRechargeLens = powerSourceDataLens
	.toField('rechargeTrigger')
	.default(
		{ trigger: 'manual' as const, parameter: { triggerText: 'never' } },
		(t) => t.trigger === 'manual' && t.parameter.triggerText === 'never'
	);
export const powerActionTypeLens = powerSourceDataLens.toField('actionType');
export const powerRequirementLens = powerSourceDataLens.toField('requirement').combine(undefinedString);
export const powerPrerequisiteLens = powerSourceDataLens.toField('prerequisite').combine(undefinedString);
export const powerTriggerLens = powerSourceDataLens.toField('trigger').combine(undefinedString);
export const effectsLens = powerSourceDataLens.toField('effects');
export const usedPoolsLens = powerSourceDataLens.toField('usedPools').default([]);
export const grantedPoolsLens = powerSourceDataLens.toField('grantedPools').default([]);
export const firstEffectLens = effectsLens.toField(0).default({
	name: '',
	note: '',
	noteLabel: '',
	target: 'One creature',
	typeAndRange: { type: 'melee', range: 'weapon' },
	attackRoll: null,
	hit: { text: '', healing: null, damage: null, activeEffectTemplate: null },
	miss: null,
});
const defaultNewEffect: PowerEffect = Object.freeze({
	name: '',
	note: '',
	noteLabel: '',
	target: '',
	typeAndRange: { type: 'within', size: 'sight' },
	attackRoll: null,
	hit: { text: '', healing: null, damage: null, activeEffectTemplate: null },
	miss: null,
});
export const newEffectLens = Lens.from<PowerEffect[], PowerEffect>(
	() => defaultNewEffect,
	(mutator) => (data) => {
		data[data.length] = mutator(data[data.length]);
	}
).default(defaultNewEffect);

export const keywordsLens = Lens.fromProp<SimpleDocumentData<PowerData>>()('data')
	.toField('keywords')
	.combine(keywordsAsStringLens);
