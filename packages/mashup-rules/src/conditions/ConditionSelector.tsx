import { useState } from 'react';
import { AppButton, FormInput, SelectItem } from '@foundryvtt-dndmashup/components';
import { Modal } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { conditionsRegistry } from './registry';
import { ConditionRule, ConditionRuleType, SimpleConditionRule } from './types';

const ruleLens = Lens.from<SimpleConditionRule, ConditionRule>(
	(rule) => rule ?? { rule: '', parameter: null as never },
	(mutator) =>
		(draft): any => {
			const result = mutator(draft ?? { rule: '', parameter: null as never });
			if (!result?.rule) return null;
			return result;
		}
);
// type NoRule = { rule: ''; parameter?: undefined } & Partial<Omit<ConditionRule, 'rule'>>;

const ruleTypeLens = ruleLens.toField('rule');
export function ConditionSelector(state: Stateful<SimpleConditionRule>) {
	const [isOpen, setOpen] = useState(false);
	const selectConditions: SelectItem<keyof ConditionRules>[] = [
		...Object.entries(conditionsRegistry).map(([key, { ruleText }]): SelectItem<keyof ConditionRules> => {
			const text = ruleText();
			return {
				key,
				value: key as ConditionRuleType,
				label: text,
				typeaheadLabel: text,
			};
		}),
	];
	const conditionRule = ruleLens.getValue(state.value);

	return (
		<div>
			<AppButton className="w-full" onClick={() => setOpen((c) => !c)}>
				{toRuleText(conditionRule)}
			</AppButton>
			<Modal isOpen={isOpen} onClose={() => setOpen(false)} title="Condition">
				<div className="min-h-64 flex flex-col">
					<div className="flex-grow">
						<FormInput.Select {...ruleTypeLens.apply(state)} options={selectConditions} className="text-center" />
						<hr className="my-1" />
						{toEditor(ruleLens.apply(state))}
					</div>
					<AppButton className="w-full" onClick={() => setOpen(false)}>
						Close
					</AppButton>
				</div>
			</Modal>
		</div>
	);
}

export function toRuleText(configuredRule: ConditionRule) {
	return conditionsRegistry[configuredRule.rule].ruleText(configuredRule.parameter as never);
}

const parameterLens = Lens.fromProp<ConditionRule>()('parameter');
export function toEditor(state: Stateful<ConditionRule>) {
	const Editor = conditionsRegistry[state.value.rule].ruleEditor;
	return <Editor {...(parameterLens.apply(state) as never)} />;
}
