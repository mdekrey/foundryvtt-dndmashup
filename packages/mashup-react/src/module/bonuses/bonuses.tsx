import classNames from 'classnames';
import { FormInput, SelectItem } from 'src/components/form-input';
import { FeatureBonus } from './types';
import { BonusTarget, ConditionRule } from './constants';
import { targets } from './bonus-sheet-utils';
import { IconButton } from 'src/components/icon-button';
import { Lens, Stateful } from 'src/core/lens';
import { conditionsRegistry } from './registry';

const selectTargets = Object.entries(targets).map(([key, { label }]) => ({
	key,
	value: key as BonusTarget,
	label,
	typeaheadLabel: label,
}));
const selectConditions = Object.entries(conditionsRegistry).map(
	([key, { label }]): SelectItem<ConditionRule | ''> => ({
		key,
		value: key === '' ? '' : (key as ConditionRule),
		label,
		typeaheadLabel: label,
	})
);

const baseLens = Lens.identity<FeatureBonus[]>();

export function Bonuses({ bonuses, className }: { bonuses: Stateful<FeatureBonus[]>; className?: string }) {
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
			return bonuses.onChangeValue((draft) => draft.splice(index, 1));
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
								<FormInput.Select
									{...baseLens.toField(idx).toField('condition').apply(bonuses)}
									options={selectConditions}
									className="text-center"
								/>
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
