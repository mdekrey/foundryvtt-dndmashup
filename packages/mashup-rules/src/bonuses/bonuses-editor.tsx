import classNames from 'classnames';
import { FormInput } from '@foundryvtt-dndmashup/components';
import { FeatureBonus } from './types';
import { NumericBonusTarget } from './constants';
import { numericBonusTargetNames } from './bonus-sheet-utils';
import { IconButton } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { useApplicationDispatcher } from '@foundryvtt-dndmashup/foundry-compat';
import { ConditionSelector } from '../conditions';

const selectTargets = Object.entries(numericBonusTargetNames).map(([key, { label }]) => ({
	key,
	value: key as NumericBonusTarget,
	label,
	typeaheadLabel: label,
}));

const baseLens = Lens.identity<FeatureBonus[]>();

const conditionRuleLens = Lens.fromProp<FeatureBonus>()('condition');

export function BonusesEditor({ bonuses, className }: { bonuses: Stateful<FeatureBonus[]>; className?: string }) {
	const apps = useApplicationDispatcher();

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
		return async () => {
			const result = await apps
				.launchApplication('dialog', {
					title: 'Are you sure...?',
					content: `Are you sure you want to delete this bonus? This cannot be undone.`,
				})
				.then(({ result }) => result)
				.catch(() => false);
			if (result)
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
								'text-sm',
								'h-10',
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
