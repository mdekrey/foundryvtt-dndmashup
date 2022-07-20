import capitalize from 'lodash/fp/capitalize';
import { FormInput } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/mashup-core';
import { DamageTypes, DamageType } from '../../../../../types/types';
import { DamageEffect } from '../dataSourceData';
import classNames from 'classnames';
import { SelectItem } from '@foundryvtt-dndmashup/components';

const damageTypeOptions = DamageTypes.map(
	(dt): SelectItem<DamageType> => ({
		value: dt,
		key: dt,
		label: capitalize(dt),
		typeaheadLabel: capitalize(dt),
	})
);

export const damageDiceLens = Lens.from<DamageEffect | null, string>(
	(e) => e?.damage ?? '',
	(mutator) => (damageDraft) => {
		const damage = mutator(damageDraft?.damage ?? '');
		console.log('new damage', damage, damageDraft, mutator);
		if (!damage) return null;
		if (damageDraft) {
			damageDraft.damage = damage;
			return damageDraft;
		} else return { type: 'damage', damage: damage, damageTypes: [] };
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
		if (damageDraft) {
			damageDraft.damageTypes = damageTypes;
			return damageDraft;
		} else return { type: 'damage', damage: '1[W]', damageTypes };
	}
);

export function DamageFields({ prefix, ...props }: { prefix?: string } & Stateful<DamageEffect | null>) {
	const damageState = damageDiceLens.apply(props);
	const damageTypeState = damageTypesLens.apply(props);
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
