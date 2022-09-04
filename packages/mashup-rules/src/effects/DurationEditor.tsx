import { FormInput, SelectItem } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { EffectDurationType, TemplateEffectDurationInfo } from './duration-types';

const durationTypeOptions: SelectItem<EffectDurationType>[] = [
	{ key: 'endOfTurn', value: 'endOfTurn', label: 'End of Turn', typeaheadLabel: 'End of Turn' },
	{ key: 'startOfTurn', value: 'startOfTurn', label: 'Start of Turn', typeaheadLabel: 'Start of Turn' },
	{ key: 'saveEnds', value: 'saveEnds', label: 'Save Ends', typeaheadLabel: 'Save Ends' },
	{ key: 'shortRest', value: 'shortRest', label: 'Until Short Rest', typeaheadLabel: 'Until Short Rest' },
	{ key: 'longRest', value: 'longRest', label: 'Until Long Rest', typeaheadLabel: 'Until Long Rest' },
	{ key: 'other', value: 'other', label: 'Other', typeaheadLabel: 'Other' },
];

const durationTypeDefaults: { [T in EffectDurationType]: Omit<TemplateEffectDurationInfo<T>, 'durationType'> } = {
	endOfTurn: { useTargetActor: true },
	startOfTurn: { useTargetActor: true },
	saveEnds: {},
	shortRest: {},
	longRest: {},
	other: { description: '' },
};

const endOfTurnUseTargetLens = Lens.fromProp<TemplateEffectDurationInfo<'endOfTurn'>>()('useTargetActor');

const startOfTurnUseTargetLens = Lens.fromProp<TemplateEffectDurationInfo<'startOfTurn'>>()('useTargetActor');

const otherDescriptionLens = Lens.fromProp<TemplateEffectDurationInfo<'other'>>()('description');

const durationTypeEditors: { [T in EffectDurationType]: React.FC<Stateful<TemplateEffectDurationInfo<T>>> } = {
	endOfTurn: (props) => (
		<>
			<FormInput.Inline>
				<FormInput.Checkbox {...endOfTurnUseTargetLens.apply(props)} />
				<FormInput.Label>use Target's Turns</FormInput.Label>
			</FormInput.Inline>
		</>
	),
	startOfTurn: (props) => (
		<>
			<FormInput.Inline>
				<FormInput.Checkbox {...startOfTurnUseTargetLens.apply(props)} />
				<FormInput.Label>use Target's Turns</FormInput.Label>
			</FormInput.Inline>
		</>
	),
	saveEnds: () => <></>,
	shortRest: () => <></>,
	longRest: () => <></>,
	other: (props) => (
		<>
			<FormInput>
				<FormInput.TextField {...otherDescriptionLens.apply(props)} />
				<FormInput.Label>Description</FormInput.Label>
			</FormInput>
		</>
	),
};

const durationTypeLens = Lens.from<TemplateEffectDurationInfo, EffectDurationType>(
	(i) => i.durationType,
	(mutator) => (draft) => {
		const newDurationType = mutator(draft.durationType);
		if (draft.durationType === newDurationType) return draft;
		return { durationType: newDurationType, ...durationTypeDefaults[newDurationType] } as TemplateEffectDurationInfo;
	}
);

export function DurationEditor(props: Stateful<TemplateEffectDurationInfo>) {
	return (
		<>
			<FormInput>
				<FormInput.Select options={durationTypeOptions} {...durationTypeLens.apply(props)} />
				<FormInput.Label>Duration Type</FormInput.Label>
			</FormInput>
			{durationTypeEditors[props.value.durationType](props as any)}
		</>
	);
}
