import { FormInput, SelectItem } from 'src/components/form-input';
import { Lens } from 'src/core/lens';
import { DamageTypes, DamageType } from 'src/types/types';
import { applyLens, ImmutableStateMutator } from 'src/components/form-input/hooks/useDocumentAsState';
import { DamageEffect } from '../dataSourceData';
import classNames from 'classnames';

const damageTypeOptions = DamageTypes.map(
	(dt): SelectItem<DamageType> => ({
		value: dt,
		key: dt,
		label: dt.capitalize(),
	})
);

export const damageDiceLens = Lens.from<DamageEffect | null, string>(
	(e) => e?.damage ?? '',
	(mutator) => (damageDraft) => {
		const damage = mutator(damageDraft?.damage ?? '');
		console.log('new damage', damage, damageDraft, mutator);
		if (!damage) return null;
		if (damageDraft) damageDraft.damage = damage;
		else return { type: 'damage', damage: damage, damageType: 'normal' };
	}
);
export const damageTypeLens = Lens.from<DamageEffect | null, DamageType>(
	(e) => e?.damageType ?? 'normal',
	(mutator) => (damageDraft) => {
		if (!damageDraft || damageDraft.damage === '') {
			return;
		}
		const damageType = mutator(damageDraft?.damageType ?? 'normal');
		if (damageDraft) damageDraft.damageType = damageType;
		else return { type: 'damage', damage: '1[W]', damageType };
	}
);

export function DamageFields({ prefix, ...props }: { prefix?: string } & ImmutableStateMutator<DamageEffect | null>) {
	const damageState = applyLens(props, damageDiceLens);
	const damageTypeState = applyLens(props, damageTypeLens);
	return (
		<div className="grid grid-cols-12 gap-x-1">
			<FormInput className="col-span-5 self-end">
				<FormInput.TextField {...damageState} />
				<FormInput.Label>{prefix} Damage Dice</FormInput.Label>
			</FormInput>
			<FormInput className={classNames('col-span-5', { 'opacity-50': !damageState.value })}>
				<FormInput.Select {...damageTypeState} options={damageTypeOptions} />
				<FormInput.Label>Damage Type</FormInput.Label>
			</FormInput>
			<div className={classNames('col-span-2', { 'opacity-50': !damageState.value })}>damage</div>
		</div>
	);
}
