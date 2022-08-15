import { useState } from 'react';
import classNames from 'classnames';
import { AppButton, FormInput, SelectItem } from '@foundryvtt-dndmashup/components';
import { conditionsRegistry, ConditionRule, ConditionRuleType, SimpleConditionRule } from '../conditions';
import { FeatureBonus } from './types';
import { NumericBonusTarget } from './constants';
import { numericBonusTargetNames } from './bonus-sheet-utils';
import { IconButton, Modal } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';

const selectTargets = Object.entries(numericBonusTargetNames).map(([key, { label }]) => ({
	key,
	value: key as NumericBonusTarget,
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

const baseLens = Lens.identity<FeatureBonus[]>();

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
const conditionRuleLens = Lens.fromProp<FeatureBonus>()('condition')
	.combine(ruleLens)
	.default<NoRule>({ rule: '' }, (r): r is NoRule => r.rule === '' || (r as any) === '');

export function Bonuses({ bonuses, className }: { bonuses: Stateful<FeatureBonus[]>; className?: string }) {
	console.log(bonuses.value);
	function onAdd() {
		bonuses.onChangeValue((draft) => {
			draft.push({
				...bonuses.value[bonuses.value.length - 1],
				amount: '0',
				target: 'defense-ac',
			});
		});
	}

	function onEnable(index: number) {
		return () =>
			bonuses.onChangeValue((draft) => {
				draft[index].disabled = false;
			});
	}

	function onDisable(index: number) {
		return () =>
			bonuses.onChangeValue((draft) => {
				draft[index].disabled = true;
			});
	}

	function onDelete(index: number) {
		return () => {
			return bonuses.onChangeValue((draft) => {
				draft.splice(index, 1);
			});
		};
	}

	return (
		<div className={className}>
			<table className="w-full border-collapse">
				<thead className="bg-theme text-white">
					<tr>
						<th>Amount</th>
						<th>Type</th>
						<th></th>
						<th>Target</th>
						<th>Condition</th>
						<th>
							<IconButton iconClassName="fa fa-plus" text="Add" onClick={onAdd} />
						</th>
					</tr>
				</thead>
				<tbody>
					{bonuses.value.map((bonus, idx) => (
						<tr
							key={idx}
							className={classNames(
								'even:bg-gradient-to-r from-transparent to-white odd:bg-transparent',
								'border-b-2 border-transparent',
								'text-sm',
								{ 'opacity-75': bonus.disabled }
							)}>
							<td className="px-1">
								<FormInput.TextField
									{...baseLens
										.toField(idx)
										.toField('amount')
										.combine(Lens.cast<string | number, string>())
										.apply(bonuses)}
									className="text-center"
								/>
							</td>
							<td className="px-1">
								<FormInput.TextField
									{...baseLens.toField(idx).toField('type').default('').apply(bonuses)}
									className="text-center"
								/>
							</td>
							<td className="px-1 whitespace-nowrap">bonus to</td>
							<td className="px-1">
								<FormInput.Select
									{...baseLens.toField(idx).toField('target').apply(bonuses)}
									options={selectTargets}
									className="text-center"
								/>
							</td>
							<td className="px-1">
								<ConditionSelector {...baseLens.toField(idx).combine(conditionRuleLens).apply(bonuses)} />
							</td>
							<td className="text-right px-1 whitespace-nowrap">
								{bonus.disabled ? (
									<IconButton iconClassName="far fa-circle" title="Click to Enable" onClick={onEnable(idx)} />
								) : (
									<IconButton iconClassName="far fa-check-circle" title="Click to Disable" onClick={onDisable(idx)} />
								)}
								<IconButton iconClassName="fas fa-trash" title="Click to Delete" onClick={onDelete(idx)} />
							</td>
						</tr>
					))}
					{bonuses.value.length === 0 ? (
						<tr
							className={classNames(
								'even:bg-gradient-to-r from-transparent to-white odd:bg-transparent',
								'border-b-2 border-transparent'
							)}>
							<td className="text-center" colSpan={6}>
								No bonuses
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
	console.log({ configuredRule });
	return conditionsRegistry[configuredRule.rule].ruleText(configuredRule.parameter as never);
}

const parameterLens = Lens.fromProp<ConditionRule | NoRule>()('parameter');
function toEditor(state: Stateful<ConditionRule | NoRule>) {
	const Editor = conditionsRegistry[state.value.rule].ruleEditor;
	return <Editor {...(parameterLens.apply(state) as never)} />;
}
