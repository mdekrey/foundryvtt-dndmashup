import classNames from 'classnames';
import { FormInput, SelectItem } from 'src/components/form-input';
import { ImmutableStateMutator, setWith } from 'src/components/form-input/hooks/useDocumentAsState';
import { Lens } from 'src/core/lens';
import { neverEver } from 'src/core/neverEver';
import {
	AreaEffectTypeAndRange,
	CloseEffectTypeAndRange,
	EffectTypeAndRange,
	MeleeEffectTypeAndRange,
} from './dataSourceData';

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

type CloseShape = CloseEffectTypeAndRange['shape'];

const closeShapeOptions: SelectItem<CloseShape>[] = [
	{
		value: 'burst',
		key: 'burst',
		label: 'burst',
	},
	{
		value: 'blast',
		key: 'blast',
		label: 'blast',
	},
];

type AreaShape = AreaEffectTypeAndRange['shape'];

const areaShapeOptions: SelectItem<AreaShape>[] = [
	{
		value: 'burst',
		key: 'burst',
		label: 'burst',
	},
	{
		value: 'wall',
		key: 'wall',
		label: 'wall',
	},
];

const closeLens = Lens.from<EffectTypeAndRange, CloseEffectTypeAndRange>(
	(effect) => (effect.type === 'close' ? effect : { type: 'close', shape: 'burst', size: 1 }),
	(mutator) => (effect) => {
		if (effect.type === 'close') effect = mutator(effect);
	}
);

const closeShapeLens = closeLens.combine(Lens.fromProp('shape'));
const closeSizeLens = closeLens.combine(Lens.fromProp('size'));

const areaLens = Lens.from<EffectTypeAndRange, AreaEffectTypeAndRange>(
	(effect) => (effect.type === 'area' ? effect : { type: 'area', shape: 'burst', size: 1, within: 10 }),
	(mutator) => (effect) => {
		if (effect.type === 'area') effect = mutator(effect);
	}
);

const areaShapeLens = areaLens.combine(Lens.fromProp('shape'));
const areaSizeLens = areaLens.combine(Lens.fromProp('size'));
const areaWithinLens = areaLens.combine(Lens.fromProp('within'));

export function TypeAndRange({ value, onChangeValue: setValue }: ImmutableStateMutator<EffectTypeAndRange>) {
	return (
		<div
			className={classNames('grid gap-1', {
				'grid-cols-2': value?.type === 'melee' || value?.type === 'ranged',
				'grid-cols-3': value?.type === 'close',
				'grid-cols-5': value?.type === 'area',
				'grid-cols-1': value?.type === undefined || value?.type === 'personal',
			})}>
			<FormInput>
				<FormInput.Select
					value={value?.type ?? 'personal'}
					onChange={(ev) => changeType(ev.currentTarget.value as EffectTypeAndRange['type'])}
					options={effectTypeOptions}
				/>
				<FormInput.Label>Effect Type</FormInput.Label>
			</FormInput>
			{value?.type === 'melee' ? (
				<>
					<FormInput>
						<FormInput.Select
							value={value.range}
							onChange={(ev) => changeMeleeRange(ev.currentTarget.value)}
							options={meleeWeaponRangeOptions}
						/>
						<FormInput.Label>Range</FormInput.Label>
					</FormInput>
				</>
			) : value?.type === 'ranged' ? (
				<>
					<FormInput className="self-end">
						<FormInput.TextField
							value={`${value.range}`}
							onChange={(ev) => changeRangedRange(ev.currentTarget.value)}
						/>
						<FormInput.Label>Range</FormInput.Label>
					</FormInput>
				</>
			) : value?.type === 'close' ? (
				<>
					<FormInput>
						<FormInput.Select value={value.shape} onChange={changeText(closeShapeLens)} options={closeShapeOptions} />
						<FormInput.Label>Shape</FormInput.Label>
					</FormInput>
					<FormInput className="self-end">
						<FormInput.TextField value={`${value.size}`} onChange={changeNumber(closeSizeLens)} />
						<FormInput.Label>Size</FormInput.Label>
					</FormInput>
				</>
			) : value?.type === 'area' ? (
				<>
					<FormInput>
						<FormInput.Select value={value.shape} onChange={changeText(areaShapeLens)} options={areaShapeOptions} />
						<FormInput.Label>Shape</FormInput.Label>
					</FormInput>
					<FormInput className="self-end">
						<FormInput.TextField value={`${value.size}`} onChange={changeNumber(areaSizeLens)} />
						<FormInput.Label>Size</FormInput.Label>
					</FormInput>
					<div>within</div>
					<FormInput className="self-end">
						<FormInput.TextField value={`${value.within}`} onChange={changeNumber(areaWithinLens)} />
						<FormInput.Label>Range</FormInput.Label>
					</FormInput>
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

	function changeText<T extends string>(lens: Lens<EffectTypeAndRange, T>) {
		return (ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
			setWith(setValue, lens, ev.currentTarget.value as T);
	}
	function changeNumber(lens: Lens<EffectTypeAndRange, number>) {
		return (ev: React.ChangeEvent<HTMLInputElement>) => {
			const result = Number(ev.currentTarget.value);
			if (!isNaN(result)) setWith(setValue, lens, result);
		};
	}
}
