import { FormInput } from '@foundryvtt-dndmashup/components';
import { Lens } from '@foundryvtt-dndmashup/core';
import { triggersRegistry } from './registry';

type ManualTriggerParameter = { triggerText: string };

declare global {
	interface Triggers {
		manual: ManualTriggerParameter;
	}
}

const baseLens = Lens.identity<ManualTriggerParameter | undefined>().default(
	{ triggerText: 'when <trigger>' as const },
	(p) => p.triggerText === 'when <trigger>'
);

const textLens = baseLens.toField('triggerText');

triggersRegistry.manual = {
	defaultParameter: { triggerText: 'when <trigger>' as const },
	text: (params) => params.triggerText ?? 'when <trigger>',
	editor: function ManualConditionParameterEditor(state) {
		return (
			<FormInput className="text-lg">
				<FormInput.TextField {...textLens.apply(state)} />
				<FormInput.Label>Trigger</FormInput.Label>
			</FormInput>
		);
	},
};
