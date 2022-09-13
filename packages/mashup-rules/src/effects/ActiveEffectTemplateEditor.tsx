import { useEffect, useState } from 'react';
import { BlockHeader, FormInput, SelectItem } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { DurationEditor } from './DurationEditor';
import { ActiveEffectTemplate } from './types';
import { activeEffectTemplateDefaultLens } from './lenses';
import { BonusesEditor } from '../bonuses';
import { TriggeredEffectsEditor } from './TriggeredEffectsEditor';

const activeEffectTemplateFieldLens = Lens.fromProp<ActiveEffectTemplate>();

type AfterEffectType = 'none' | 'after-save' | 'after-failed';
const options: SelectItem<AfterEffectType>[] = [
	{ key: 'none', value: 'none', label: 'None', typeaheadLabel: 'None' },
	{ key: 'after-save', value: 'after-save', label: 'After Effect', typeaheadLabel: 'After Effect' },
	{ key: 'after-failed', value: 'after-failed', label: 'Failed Save', typeaheadLabel: 'Failed Save' },
];

const imageLens = activeEffectTemplateFieldLens('image');
const labelLens = activeEffectTemplateFieldLens('label');
const useStandardLens = activeEffectTemplateFieldLens('useStandard');
const coreStatusIdLens = activeEffectTemplateFieldLens('coreStatusId').default('', (v) => !v);
const durationLens = activeEffectTemplateFieldLens('duration');
const bonusesLens = activeEffectTemplateFieldLens('bonuses');
const triggersLens = activeEffectTemplateFieldLens('triggeredEffects').default([]);
const toAfterEffectType = (t: ActiveEffectTemplate) =>
	t.afterEffect !== null ? 'after-save' : t.afterFailedSave !== null ? 'after-failed' : 'none';
const afterEffectLens = activeEffectTemplateFieldLens('afterEffect').combine(activeEffectTemplateDefaultLens);
const afterFailedSaveLens = activeEffectTemplateFieldLens('afterFailedSave').combine(activeEffectTemplateDefaultLens);

const standardEffects: SelectItem<string>[] = [
	{ key: 'dead', value: 'dead', label: 'Dead', typeaheadLabel: 'Dead' },
	{ key: 'bloodied', value: 'bloodied', label: 'Bloodied', typeaheadLabel: 'Bloodied' },

	{ key: 'blinded', value: 'blinded', label: 'Blinded', typeaheadLabel: 'Blinded' },
	{ key: 'dazed', value: 'dazed', label: 'Dazed', typeaheadLabel: 'Dazed' },
	{ key: 'deafened', value: 'deafened', label: 'Deafened', typeaheadLabel: 'Deafened' },
	{ key: 'dominated', value: 'dominated', label: 'Dominated', typeaheadLabel: 'Dominated' },
	{ key: 'dying', value: 'dying', label: 'Dying', typeaheadLabel: 'Dying' },
	{ key: 'helpless', value: 'helpless', label: 'Helpless', typeaheadLabel: 'Helpless' },
	{ key: 'immobilized', value: 'immobilized', label: 'Immobilized', typeaheadLabel: 'Immobilized' },

	{ key: 'petrified', value: 'petrified', label: 'Petrified', typeaheadLabel: 'Petrified' },
	{ key: 'prone', value: 'prone', label: 'Prone', typeaheadLabel: 'Prone' },
	{ key: 'restrained', value: 'restrained', label: 'Restrained', typeaheadLabel: 'Restrained' },
	{ key: 'slowed', value: 'slowed', label: 'Slowed', typeaheadLabel: 'Slowed' },
	{ key: 'stunned', value: 'stunned', label: 'Stunned', typeaheadLabel: 'Stunned' },
	{ key: 'surprised', value: 'surprised', label: 'Surprised', typeaheadLabel: 'Surprised' },
	{ key: 'unconscious', value: 'unconscious', label: 'Unconscious', typeaheadLabel: 'Unconscious' },
	{ key: 'weakened', value: 'weakened', label: 'Weakened', typeaheadLabel: 'Weakened' },
];

const coreStatusIdWithLabelLens = Lens.from<ActiveEffectTemplate, string>(
	(s) => s.coreStatusId ?? 'none',
	(mutator) => (draft) => {
		const resultStatusId = mutator(draft.coreStatusId ?? 'none');
		draft.coreStatusId = resultStatusId;
		const status = standardEffects.find(({ value }) => value === resultStatusId);
		if (status) {
			draft.label = status.typeaheadLabel;
		}
		return draft;
	}
);

export function ActiveEffectTemplateEditor({
	fallbackImage,
	...props
}: { fallbackImage?: string | null } & Stateful<ActiveEffectTemplate>) {
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
		<div>
			<div className="flex flex-row gap-1">
				<FormInput.ImageEditor
					title="Effect Image"
					{...imageLens.apply(props)}
					defaultImage={fallbackImage ?? undefined}
				/>
				<div className="flex-grow">
					<FormInput>
						<FormInput.TextField {...labelLens.apply(props)} />
						<FormInput.Label>Label</FormInput.Label>
					</FormInput>
					<FormInput.Inline className="whitespace-nowrap items-baseline">
						<FormInput.Checkbox {...useStandardLens.apply(props)} />
						<span>is PHB Condition</span>
					</FormInput.Inline>
					<FormInput>
						{props.value.useStandard ? (
							<FormInput.Select {...coreStatusIdWithLabelLens.apply(props)} options={standardEffects} />
						) : (
							<FormInput.TextField {...coreStatusIdLens.apply(props)} />
						)}
						<FormInput.Label>Unique Id</FormInput.Label>
						<span className="text-2xs">(others with same ID get removed when applied)</span>
					</FormInput>
				</div>
			</div>
			<BlockHeader className="my-1">Duration</BlockHeader>
			<DurationEditor {...durationLens.apply(props)} />
			<BlockHeader className="mt-1">Bonuses</BlockHeader>
			<BonusesEditor bonuses={bonusesLens.apply(props)} />

			<BlockHeader className="mt-1">Triggers</BlockHeader>
			<TriggeredEffectsEditor triggeredEffects={triggersLens.apply(props)} />

			<BlockHeader className="my-1">Changes over time</BlockHeader>
			<FormInput>
				<FormInput.Select options={options} value={afterEffectType} onChange={setAfterEffectType} />
				<FormInput.Label>After Effect Type</FormInput.Label>
			</FormInput>
			{afterEffectType === 'none' ? null : (
				<ActiveEffectTemplateEditor
					key={afterEffectType}
					fallbackImage={props.value.image ?? fallbackImage}
					{...(afterEffectType === 'after-save' ? afterEffectLens : afterFailedSaveLens).apply(props)}
				/>
			)}
		</div>
	);
}
