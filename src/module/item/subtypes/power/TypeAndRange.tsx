import { FormInput, SelectItem } from 'src/components/form-input';
import { ImmutableStateMutator } from 'src/components/form-input/hooks/useDocumentAsState';
import { neverEver } from 'src/core/neverEver';
import { EffectTypeAndRange, MeleeEffectTypeAndRange } from './dataSourceData';

const effectTypeOptions: SelectItem<EffectTypeAndRange['type']>[] = [
	{
		value: 'melee',
		key: 'melee',
		label: 'Melee',
	},
	{
		value: 'ranged',
		key: 'ranged',
		label: 'Ranged',
	},
	{
		value: 'close',
		key: 'close',
		label: 'Close',
	},
	{
		value: 'area',
		key: 'area',
		label: 'Area',
	},
	{
		value: 'personal',
		key: 'personal',
		label: 'Personal',
	},
];

const meleeWeaponRangeOptions: SelectItem<MeleeEffectTypeAndRange['range']>[] = [
	{
		value: 'weapon',
		key: 'weapon',
		label: 'Weapon',
	},
	{
		value: 1,
		key: '1',
		label: '1',
	},
	{
		value: 'touch',
		key: 'touch',
		label: 'Touch',
	},
];

export function TypeAndRange({ state: [value, setValue] }: { state: ImmutableStateMutator<EffectTypeAndRange> }) {
	return (
		<div className="flex flex-row gap-1">
			<FormInput.Select
				className="flex-grow"
				value={value?.type ?? 'personal'}
				onChange={(ev) => changeType(ev.currentTarget.value as EffectTypeAndRange['type'])}
				options={effectTypeOptions}
			/>
			{value?.type === 'melee' ? (
				<>
					<FormInput.Select
						value={value.range}
						onChange={(ev) => changeMeleeRange(ev.currentTarget.value)}
						options={meleeWeaponRangeOptions}
					/>
				</>
			) : value?.type === 'ranged' ? (
				<>
					<FormInput.TextField value={value.range} onChange={(ev) => changeRangedRange(ev.currentTarget.value)} />
				</>
			) : value?.type === 'close' ? (
				<>
					{value.shape} {value.size}
				</>
			) : value?.type === 'area' ? (
				<>
					{value.shape} {value.size} within {value.within}
				</>
			) : (
				<></>
			)}
		</div>
	);

	function changeType(type: EffectTypeAndRange['type']) {
		switch (type) {
			case 'melee':
				setValue(() => ({ type, range: 'weapon' }), { deleteData: true });
				return;
			case 'ranged':
				setValue(() => ({ type, range: 'weapon' }), { deleteData: true });
				return;
			case 'close':
				setValue(() => ({ type, shape: 'burst', size: 1 }), { deleteData: true });
				return;
			case 'area':
				setValue(() => ({ type, shape: 'burst', size: 1, within: 10 }), { deleteData: true });
				return;
			case 'personal':
				setValue(() => ({ type }), { deleteData: true });
				return;
			default:
				setValue(neverEver(type));
		}
	}

	function changeMeleeRange(key: string) {
		const range = meleeWeaponRangeOptions.find((o) => o.key === key)?.value;
		if (range === undefined) throw new Error('unknown range for melee');
		setValue((target) => {
			if (target.type === 'melee') {
				target.range = range;
			}
		});
	}

	function changeRangedRange(value: string) {
		const range = value === 'weapon' || value === 'sight' ? value : Number(value);
		if (typeof range === 'number' && isNaN(range)) return;
		setValue((target) => {
			if (target.type === 'ranged') {
				target.range = range;
			}
		});
	}
}
