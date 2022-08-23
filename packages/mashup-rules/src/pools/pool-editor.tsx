import { DetailsModalButton, FormInput, IconButton, SelectItem } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { useApplicationDispatcher } from '@foundryvtt-dndmashup/foundry-compat';
import classNames from 'classnames';
import { PoolLimits, PoolRechargeConfiguration, PoolRegain, PoolReset } from './types';
import { isRegainPoolRecharge } from './utils';

const baseLens = Lens.identity<PoolLimits[]>();

export function PoolsEditor({ pools, className }: { pools: Stateful<PoolLimits[]>; className?: string }) {
	const apps = useApplicationDispatcher();
	function onAdd() {
		pools.onChangeValue((draft) => {
			if (draft.length === 0) {
				draft.push({
					longRest: null,
					max: null,
					maxBetweenRest: null,
					shortRest: null,
					name: '',
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
		return async () => {
			const result = await apps
				.launchApplication('dialog', {
					title: 'Are you sure...?',
					content: `Are you sure you want to delete this resource? This cannot be undone.`,
				})
				.then(({ result }) => result)
				.catch(() => false);
			if (result)
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
						<th>Max</th>
						<th>Max Between Rest</th>
						<th>After a Long Rest&hellip;</th>
						<th>After a Short Rest&hellip;</th>
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
									'text-sm',
									'h-10'
								)}>
								<td className="px-1">
									<FormInput.TextField
										{...baseLens.toField(idx).toField('name').apply(pools)}
										className="text-center"
									/>
								</td>
								<td className="px-1">
									<FormInput.NumberField
										{...indexedLens
											.toField('max')
											.default(0, (v) => v === 0)
											.apply(pools)}
										className="text-center"
									/>
								</td>
								<td className="px-1">
									<FormInput.NumberField
										{...indexedLens
											.toField('maxBetweenRest')
											.default(0, (v) => v === 0)
											.apply(pools)}
										className="text-center"
									/>
								</td>
								<td className="px-1">
									<RechargeOptions {...indexedLens.toField('longRest').apply(pools)} title="Long Rest" />
								</td>
								<td className="px-1">
									<RechargeOptions {...indexedLens.toField('shortRest').apply(pools)} title="Short Rest" />
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
							<td className="text-center" colSpan={6}>
								No pools
							</td>
						</tr>
					) : null}
				</tbody>
			</table>
		</div>
	);
}

const rechargeValueLens = Lens.from<PoolRechargeConfiguration, number>(
	(source) => (source === null ? 0 : isRegainPoolRecharge(source) ? source.regain : source.reset),
	(mutator) => (draft) => {
		if (draft === null) return null;
		if (isRegainPoolRecharge(draft)) return { regain: mutator(draft.regain) };
		return { reset: mutator(draft.reset) };
	}
);
type RechargeType = 'none' | 'reset' | 'regain';
const rechargeTypeLens = Lens.from<PoolRechargeConfiguration, RechargeType>(
	(source) => (source === null ? 'none' : isRegainPoolRecharge(source) ? 'regain' : 'reset'),
	(mutator) => () => {
		switch (mutator('none')) {
			case 'reset':
				return { reset: 1 };
			case 'regain':
				return { regain: 1 };
			default:
				return null;
		}
	}
);
const rechargeTypeOptions: SelectItem<RechargeType>[] = [
	{ value: 'none', key: 'none', label: 'N/A', typeaheadLabel: 'N/A' },
	{ value: 'reset', key: 'reset', label: 'After rest, reset to...', typeaheadLabel: 'reset' },
	{ value: 'regain', key: 'regain', label: 'After rest, regain...', typeaheadLabel: 'regain' },
];

function RechargeOptions({ title, ...state }: { title: string } & Stateful<PoolRegain | PoolReset | null>) {
	const buttonText = getButtonText(state.value);
	return (
		<DetailsModalButton
			className="w-full"
			buttonContents={buttonText}
			modalTitle={`Configure ${title} Recharge`}
			modalContents={
				<div className="grid grid-cols-1 gap-x-1 text-lg text-center">
					<FormInput.Select {...rechargeTypeLens.apply(state)} options={rechargeTypeOptions} />
					<FormInput>
						<FormInput.NumberField {...rechargeValueLens.apply(state)} className="text-lg text-center" />
						<FormInput.Label>Amount</FormInput.Label>
					</FormInput>
				</div>
			}
		/>
	);

	function getButtonText(value: PoolRegain | PoolReset | null) {
		if (value === null) return 'N/A';
		if (isRegainPoolRecharge(value)) return `Gain ${value.regain}`;
		return `Set to ${value.reset}`;
	}
}
