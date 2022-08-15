import { useState } from 'react';
import classNames from 'classnames';
import { AppButton, FormInput, SelectItem } from '@foundryvtt-dndmashup/components';
import { conditionsRegistry, ConditionRule, ConditionRuleType, SimpleConditionRule } from '../conditions';
import { DynamicListEntry } from './types';
import { DynamicListTarget } from './constants';
import { dynamicListTargetNames } from './dynamic-list-sheet-utils';
import { IconButton, Modal } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';

const selectTargets = Object.entries(dynamicListTargetNames).map(([key, { label }]) => ({
	key,
	value: key as DynamicListTarget,
	label,
	typeaheadLabel: label,
}));
const selectConditions: SelectItem<keyof ConditionRules>[] = [
	...Object.entries(conditionsRegistry).map(([key, { ruleText }]): SelectItem<keyof ConditionRules> => {
		const text = ruleText();
		const label = `when ${text}`;
		return {
			key,
			value: key as ConditionRuleType,
			label,
			typeaheadLabel: label,
		};
	}),
];

const baseLens = Lens.identity<DynamicListEntry[]>().default([]);

const ruleLens = Lens.from<SimpleConditionRule, SimpleConditionRule>(
	(rule) => rule,
	(mutator) =>
		(draft): any => {
			const result = mutator(draft);
			if (!result?.rule) return null;
			return result;
		}
);
type NoRule = { rule: ''; parameter?: undefined } & Partial<Omit<ConditionRule, 'rule'>>;
const conditionRuleLens = Lens.fromProp<DynamicListEntry>()('condition')
	.combine(ruleLens)
	.default<NoRule>({ rule: '' }, (r): r is NoRule => r.rule === '');

export function DynamicList({
	dynamicList,
	className,
}: {
	dynamicList: Stateful<DynamicListEntry[]>;
	className?: string;
}) {
	function onAdd() {
		dynamicList.onChangeValue((draft) => {
			draft.push({
				...dynamicList.value[dynamicList.value.length - 1],
				target: 'languagesKnown',
				entry: 'Common',
			});
		});
	}

	function onEnable(index: number) {
		return () =>
			dynamicList.onChangeValue((draft) => {
				draft[index].disabled = false;
			});
	}

	function onDisable(index: number) {
		return () =>
			dynamicList.onChangeValue((draft) => {
				draft[index].disabled = true;
			});
	}

	function onDelete(index: number) {
		return () => {
			return dynamicList.onChangeValue((draft) => {
				draft.splice(index, 1);
			});
		};
	}

	return (
		<div className={className}>
			<table className="w-full border-collapse">
				<thead className="bg-theme text-white">
					<tr>
						<th>List</th>
						<th>Entry</th>
						<th>Condition</th>
						<th>
							<IconButton iconClassName="fa fa-plus" text="Add" onClick={onAdd} />
						</th>
					</tr>
				</thead>
				<tbody>
					{(dynamicList.value ?? []).map((entry, idx) => (
						<tr
							key={idx}
							className={classNames(
								'even:bg-gradient-to-r from-transparent to-white odd:bg-transparent',
								'border-b-2 border-transparent',
								'text-sm',
								{ 'opacity-75': entry.disabled }
							)}>
							<td className="px-1">
								<FormInput.Select
									{...baseLens.toField(idx).toField('target').apply(dynamicList)}
									options={selectTargets}
									className="text-center"
								/>
							</td>
							<td className="px-1">
								<FormInput.TextField
									{...baseLens.toField(idx).toField('entry').apply(dynamicList)}
									className="text-center"
								/>
							</td>
							<td className="px-1">
								<ConditionSelector {...baseLens.toField(idx).combine(conditionRuleLens).apply(dynamicList)} />
							</td>
							<td className="text-right px-1 whitespace-nowrap">
								{entry.disabled ? (
									<IconButton iconClassName="far fa-circle" title="Click to Enable" onClick={onEnable(idx)} />
								) : (
									<IconButton iconClassName="far fa-check-circle" title="Click to Disable" onClick={onDisable(idx)} />
								)}
								<IconButton iconClassName="fas fa-trash" title="Click to Delete" onClick={onDelete(idx)} />
							</td>
						</tr>
					))}
					{dynamicList.value.length === 0 ? (
						<tr
							className={classNames(
								'even:bg-gradient-to-r from-transparent to-white odd:bg-transparent',
								'border-b-2 border-transparent'
							)}>
							<td className="text-center" colSpan={6}>
								No entries
							</td>
						</tr>
					) : null}
				</tbody>
			</table>
		</div>
	);
}

const ruleTypeLens = Lens.fromProp<ConditionRule | NoRule>()('rule');
function ConditionSelector(state: Stateful<ConditionRule | NoRule>) {
	const [isOpen, setOpen] = useState(false);

	return (
		<>
			<AppButton className="w-full" onClick={() => setOpen((c) => !c)}>
				{toRuleText(state.value)}
			</AppButton>
			<Modal isOpen={isOpen} onClose={() => setOpen(false)} title="Condition">
				<FormInput.Select {...ruleTypeLens.apply(state)} options={selectConditions} className="text-center" />
				<hr className="my-1" />
				{toEditor(state)}
				<AppButton className="w-full" onClick={() => setOpen(false)}>
					Close
				</AppButton>
			</Modal>
		</>
	);
}

function toRuleText(configuredRule: ConditionRule | NoRule) {
	return conditionsRegistry[configuredRule.rule].ruleText(configuredRule.parameter as never);
}

const parameterLens = Lens.fromProp<ConditionRule | NoRule>()('parameter');
function toEditor(state: Stateful<ConditionRule | NoRule>) {
	const Editor = conditionsRegistry[state.value.rule].ruleEditor;
	return <Editor {...(parameterLens.apply(state) as never)} />;
}
