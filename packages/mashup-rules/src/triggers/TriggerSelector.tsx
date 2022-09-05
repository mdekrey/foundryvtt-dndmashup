import { useState } from 'react';
import { AppButton, FormInput, Modal, SelectItem } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { Trigger } from './types';
import { triggersRegistry } from './registry';

const triggerTypeLens = Lens.fromProp<Trigger>()('trigger');

export function TriggerSelector(state: Stateful<Trigger>) {
	const [isOpen, setOpen] = useState(false);
	const selectTriggers: SelectItem<keyof Triggers>[] = [
		...Object.entries(triggersRegistry).map(([key, { text }]): SelectItem<keyof Triggers> => {
			const label = text();
			return {
				key,
				value: key as keyof Triggers,
				label,
				typeaheadLabel: label,
			};
		}),
	];
	const trigger = state.value;

	return (
		<div>
			<AppButton className="w-full" onClick={() => setOpen((c) => !c)}>
				{toRuleText(trigger)}
			</AppButton>
			<Modal isOpen={isOpen} onClose={() => setOpen(false)} title="Trigger" options={{ resizable: true }}>
				<div className="min-h-64 flex flex-col">
					<div className="flex-grow">
						<FormInput.Select {...triggerTypeLens.apply(state)} options={selectTriggers} className="text-center" />
						<hr className="my-1" />
						{toEditor(state)}
					</div>
					<AppButton className="w-full" onClick={() => setOpen(false)}>
						Close
					</AppButton>
				</div>
			</Modal>
		</div>
	);
}

export function toRuleText(trigger: Trigger) {
	return triggersRegistry[trigger.trigger].text(trigger.parameter as never);
}

const parameterLens = Lens.fromProp<Trigger>()('parameter');
export function toEditor(state: Stateful<Trigger>) {
	const Editor = triggersRegistry[state.value.trigger].editor;
	return <Editor {...(parameterLens.apply(state) as never)} />;
}
