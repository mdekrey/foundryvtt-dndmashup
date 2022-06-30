import { FormInput } from 'src/components/form-input';
import { Lens } from 'src/core/lens';
import { DamageTypes, DamageType } from 'src/types/types';
import { applyLens, ImmutableStateMutator } from 'src/components/form-input/hooks/useDocumentAsState';
import { DamageEffect } from '../dataSourceData';
import classNames from 'classnames';
import { SelectItem } from 'src/components/form-input';

const damageTypeOptions = DamageTypes.map(
	(dt): SelectItem<DamageType> => ({
		value: dt,
		key: dt,
		label: dt.capitalize(),
		typeaheadLabel: dt.capitalize(),
	})
);

export const damageDiceLens = Lens.from<DamageEffect | null, string>(
	(e) => e?.damage ?? '',
	(mutator) => (damageDraft) => {
		const damage = mutator(damageDraft?.damage ?? '');
		console.log('new damage', damage, damageDraft, mutator);
		if (!damage) return null;
		if (damageDraft) damageDraft.damage = damage;
		else return { type: 'damage', damage: damage, damageTypes: [] };
	}
);
export const damageTypesLens = Lens.from<DamageEffect | null, DamageType[]>(
	(e) => {
		return e?.damageTypes ?? [];
	},
	(mutator) => (damageDraft) => {
		if (!damageDraft || damageDraft.damage === '') {
			return;
		}
		const damageTypes = mutator(damageDraft?.damageTypes ?? []);
		if (damageDraft) damageDraft.damageTypes = damageTypes;
		else return { type: 'damage', damage: '1[W]', damageTypes };
	}
);

export function DamageFields({ prefix, ...props }: { prefix?: string } & ImmutableStateMutator<DamageEffect | null>) {
	const damageState = applyLens(props, damageDiceLens);
	const damageTypeState = applyLens(props, damageTypesLens);
	return (
		<div className="grid grid-cols-12 gap-x-1">
			<FormInput className="col-span-5 self-end">
				<FormInput.TextField {...damageState} />
				<FormInput.Label>{prefix} Damage Dice</FormInput.Label>
			</FormInput>
			<FormInput className={classNames('col-span-5', { 'opacity-50': !damageState.value })}>
				<FormInput.MultiSelect {...damageTypeState} options={damageTypeOptions} />
				<FormInput.Label>Damage Type</FormInput.Label>
			</FormInput>
			<div className={classNames('col-span-2', { 'opacity-50': !damageState.value })}>damage</div>
		</div>
	);
}
