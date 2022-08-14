import { FormInput } from '@foundryvtt-dndmashup/components';
import { SelectItem } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import classNames from 'classnames';
import { Defense, defenses } from '../../../../../types/types';
import { AttackRoll } from '../dataSourceData';

const abilityLens = Lens.from<AttackRoll | null, string>(
	(attackRoll) => attackRoll?.attack ?? '',
	(mutator) => (draft) => {
		const attackRoll = mutator(draft?.attack || '');

		if (attackRoll !== '' && draft) {
			draft.attack = attackRoll;
			return draft;
		} else {
			return attackRoll === '' ? null : { attack: attackRoll, defense: 'ac' };
		}
	}
);

const defenseLens = Lens.from<AttackRoll | null, Defense>(
	(attackRoll) => attackRoll?.defense ?? 'ac',
	(mutator) => (draft) => {
		if (draft) draft.defense = mutator(draft.defense);
	}
);

const defenseOptions = defenses.map(
	(ability): SelectItem<Defense> => ({
		key: ability,
		value: ability,
		label: ability.toUpperCase(),
		typeaheadLabel: ability.toUpperCase(),
	})
);

export function AttackRollFields(props: Stateful<AttackRoll | null>) {
	const abilityState = abilityLens.apply(props);

	return (
		<div className="grid gap-1 grid-cols-12">
			<FormInput className="col-span-3">
				<FormInput.TextField {...abilityState} />
				<FormInput.Label>Attack Ability</FormInput.Label>
			</FormInput>
			<div className="justify-self-center">vs.</div>
			<FormInput className={classNames('col-span-3', { 'opacity-50 focus-within:opacity-100': !props.value })}>
				<FormInput.Select {...defenseLens.apply(props)} options={props.value ? defenseOptions : []} />
				<FormInput.Label>Defense</FormInput.Label>
			</FormInput>
		</div>
	);
}
