import { FormInput, SelectItem } from '@foundryvtt-dndmashup/components';
import { Lens } from '@foundryvtt-dndmashup/core';
import { triggersRegistry } from './registry';

type DieRollParameter = { number: 2 | 3 | 4 | 5 | 6 };

declare global {
	interface Triggers {
		d6: DieRollParameter;
	}
}

const baseLens = Lens.identity<DieRollParameter | undefined>().default({ number: 6 });

const numberLens = baseLens.toField('number');

const numberOptions: SelectItem<DieRollParameter['number']>[] = [
	{
		value: 6,
		key: 6,
		label: 'Recharge 6',
		typeaheadLabel: 'Recharge 6',
	},
	{
		value: 5,
		key: 5,
		label: 'Recharge 5',
		typeaheadLabel: 'Recharge 5',
	},
	{
		value: 4,
		key: 4,
		label: 'Recharge 4',
		typeaheadLabel: 'Recharge 4',
	},
	{
		value: 3,
		key: 3,
		label: 'Recharge 3',
		typeaheadLabel: 'Recharge 3',
	},
	{
		value: 2,
		key: 2,
		label: 'Recharge 2',
		typeaheadLabel: 'Recharge 2',
	},
];

triggersRegistry.d6 = {
	defaultParameter: { number: 6 },
	text: (params) => `when a ${params?.number ?? 6} is rolled on a d6`,
	editor: function DieRollParameterEditor(state) {
		return (
			<FormInput className="text-lg">
				<FormInput.Select options={numberOptions} {...numberLens.apply(state)} />
				<FormInput.Label>Trigger</FormInput.Label>
			</FormInput>
		);
	},
};
