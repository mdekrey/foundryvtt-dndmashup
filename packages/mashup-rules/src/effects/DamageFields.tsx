import capitalize from 'lodash/fp/capitalize';
import { FormInput } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { damageTypes, DamageType } from '../types';
import { DamageEffect } from './types';
import classNames from 'classnames';
import { SelectItem } from '@foundryvtt-dndmashup/components';

const damageTypeOptions = damageTypes.map(
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
		if (!damage) return null;
		if (damageDraft) {
			damageDraft.damage = damage;
			return damageDraft;
		} else return { damage: damage, damageTypes: [] };
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
		} else return { damage: '1[W]', damageTypes };
	}
);

export function DamageFields({
	className,
	prefix,
	...props
}: { prefix?: string; className?: string } & Stateful<DamageEffect | null>) {
	const damageState = damageDiceLens.apply(props);
	const damageTypeState = damageTypesLens.apply(props);
	return (
		<div className={classNames('grid grid-cols-12 gap-x-1', className)}>
			<FormInput className="col-span-5 self-end">
				<FormInput.TextField {...damageState} />
				<FormInput.Label>{prefix} Damage Dice</FormInput.Label>
			</FormInput>
			<FormInput className={classNames('col-span-5', { 'opacity-50 focus-within:opacity-100': !damageState.value })}>
				<FormInput.MultiSelect
					{...damageTypeState}
					options={damageState.value ? damageTypeOptions : []}
					disabled={!damageState.value}
				/>
				<FormInput.Label>Damage Type</FormInput.Label>
			</FormInput>
		</div>
	);
}
