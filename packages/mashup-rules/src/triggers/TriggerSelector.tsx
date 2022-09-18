import { useState } from 'react';
import { AppButton, FormInput, Modal, SelectItem } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { Trigger, TriggerType } from './types';
import { triggersRegistry } from './registry';

const triggerTypeLens = Lens.from<Trigger, TriggerType>(
	(trigger) => trigger.trigger,
	(mutator) => (draft) => {
		const newTriggerType = mutator(draft.trigger);
		if (draft.trigger === newTriggerType) return draft;
		return { trigger: newTriggerType, parameter: triggersRegistry[newTriggerType].defaultParameter } as Trigger;
	}
);

export function TriggerSelector({ className, ...state }: Stateful<Trigger> & { className?: string }) {
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
		<div className={className}>
			<AppButton className="w-full" onClick={() => setOpen((c) => !c)}>
				{toTriggerText(trigger)}
			</AppButton>
			<Modal isOpen={isOpen} onClose={() => setOpen(false)} title="Trigger">
				<div className="min-h-64 flex flex-col">
					<div className="flex-grow">
						<FormInput.Select {...triggerTypeLens.apply(state)} options={selectTriggers} className="text-center" />
						<hr className="my-1" />
						{toTriggerParamterEditor(state)}
					</div>
					<AppButton className="w-full" onClick={() => setOpen(false)}>
						Close
					</AppButton>
				</div>
			</Modal>
		</div>
	);
}

export function toTriggerText(trigger: Trigger) {
	return triggersRegistry[trigger.trigger].text(trigger.parameter as never);
}

const parameterLens = Lens.fromProp<Trigger>()('parameter');
function toTriggerParamterEditor(state: Stateful<Trigger>) {
	const Editor = triggersRegistry[state.value.trigger].editor;
	return <Editor {...(parameterLens.apply(state) as never)} />;
}
