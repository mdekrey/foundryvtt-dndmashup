import { FormInput, IconButton, SelectItem } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import classNames from 'classnames';
import { PoolBonus, PoolBonusTarget } from './types';

const baseLens = Lens.identity<PoolBonus[]>();

const targetOptions: SelectItem<PoolBonusTarget>[] = [
	{ value: 'max', key: 'max', label: 'Max', typeaheadLabel: 'Max' },
	{ value: 'longRest', key: 'longRest', label: 'gained per Long Rest', typeaheadLabel: 'gained per Long Rest' },
	{ value: 'shortRest', key: 'shortRest', label: 'gained per Short Rest', typeaheadLabel: 'gained per Short Rest' },
	{ value: 'perRest', key: 'perRest', label: 'Max used per Rest', typeaheadLabel: 'Max used per Rest' },
];

export function PoolBonusEditor({ pools, className }: { pools: Stateful<PoolBonus[]>; className?: string }) {
	function onAdd() {
		pools.onChangeValue((draft) => {
			if (draft.length === 0) {
				draft.push({
					name: '',
					target: 'max',
					amount: 1,
				});
			} else {
				draft.push({
					...pools.value[pools.value.length - 1],
					name: '',
				});
			}
		});
	}

	function onDelete(index: number) {
		return () => {
			return pools.onChangeValue((draft) => {
				draft.splice(index, 1);
			});
		};
	}

	return (
		<div className={className}>
			<table className="w-full border-collapse">
				<thead className="bg-theme text-white">
					<tr>
						<th>Name</th>
						<th>Amount</th>
						<th>Target</th>
						<th>
							<IconButton iconClassName="fa fa-plus" text="Add" onClick={onAdd} />
						</th>
					</tr>
				</thead>
				<tbody>
					{pools.value.map((pool, idx) => {
						const indexedLens = baseLens.toField(idx);
						return (
							<tr
								key={idx}
								className={classNames(
									'even:bg-gradient-to-r from-transparent to-white odd:bg-transparent',
									'border-b-2 border-transparent',
									'text-sm'
								)}>
								<td className="px-1">
									<FormInput.TextField
										{...baseLens.toField(idx).toField('name').apply(pools)}
										className="text-center"
									/>
								</td>
								<td className="px-1">
									<FormInput.TextField
										{...indexedLens.toField('amount').combine(Lens.cast<string | number, string>()).apply(pools)}
										className="text-center"
									/>
								</td>
								<td className="px-1">
									<FormInput.Select
										className="w-full"
										{...baseLens.toField(idx).toField('target').apply(pools)}
										options={targetOptions}
									/>
								</td>
								<td className="text-right px-1 whitespace-nowrap">
									<IconButton iconClassName="fas fa-trash" title="Click to Delete" onClick={onDelete(idx)} />
								</td>
							</tr>
						);
					})}
					{pools.value.length === 0 ? (
						<tr
							className={classNames(
								'even:bg-gradient-to-r from-transparent to-white odd:bg-transparent',
								'border-b-2 border-transparent'
							)}>
							<td className="text-center" colSpan={4}>
								No pool bonuses
							</td>
						</tr>
					) : null}
				</tbody>
			</table>
		</div>
	);
}
