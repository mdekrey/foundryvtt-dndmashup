import { useEffect, useState } from 'react';
import { FormInput, SelectItem } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { BonusesEditor } from '@foundryvtt-dndmashup/mashup-rules';
import { DurationEditor } from '../module/active-effect/DurationEditor';
import { ActiveEffectTemplate } from './types';
import { activeEffectTemplateDefaultLens } from './lenses';

const activeEffectTemplateFieldLens = Lens.fromProp<ActiveEffectTemplate>();

type AfterEffectType = 'none' | 'after-save' | 'after-failed';
const options: SelectItem<AfterEffectType>[] = [
	{ key: 'none', value: 'none', label: 'None', typeaheadLabel: 'None' },
	{ key: 'after-save', value: 'after-save', label: 'After Effect', typeaheadLabel: 'After Effect' },
	{ key: 'after-failed', value: 'after-failed', label: 'Failed Save', typeaheadLabel: 'Failed Save' },
];

const durationLens = activeEffectTemplateFieldLens('duration');
const bonusesLens = activeEffectTemplateFieldLens('bonuses');
const toAfterEffectType = (t: ActiveEffectTemplate) =>
	t.afterEffect !== null ? 'after-save' : t.afterFailedSave !== null ? 'after-failed' : 'none';
const afterEffectLens = activeEffectTemplateFieldLens('afterEffect').combine(activeEffectTemplateDefaultLens);
const afterFailedSaveLens = activeEffectTemplateFieldLens('afterFailedSave').combine(activeEffectTemplateDefaultLens);

export function ActiveEffectTemplateEditor(props: Stateful<ActiveEffectTemplate>) {
	const actualAfterEffectType = toAfterEffectType(props.value);
	const [afterEffectType, setAfterEffectType] = useState<AfterEffectType>(actualAfterEffectType);

	useEffect(() => {
		if (actualAfterEffectType === 'none') return;

		props.onChangeValue((draft) => {
			if (afterEffectType !== 'after-failed') draft.afterFailedSave = null;
			if (afterEffectType !== 'after-save') draft.afterEffect = null;
			return draft;
		});
	}, [afterEffectType, actualAfterEffectType]);

	return (
		<>
			<DurationEditor {...durationLens.apply(props)} />
			<BonusesEditor bonuses={bonusesLens.apply(props)} />
			<FormInput>
				<FormInput.Select options={options} value={afterEffectType} onChange={setAfterEffectType} />
				<FormInput.Label>After Effect Type</FormInput.Label>
			</FormInput>
			{afterEffectType === 'none' ? null : (
				<ActiveEffectTemplateEditor
					key={afterEffectType}
					{...(afterEffectType === 'after-save' ? afterEffectLens : afterFailedSaveLens).apply(props)}
				/>
			)}
		</>
	);
}
