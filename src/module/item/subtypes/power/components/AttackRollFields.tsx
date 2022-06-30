import { FormInput } from 'src/components/form-input';
import { applyLens, ImmutableStateMutator } from 'src/components/form-input/hooks/useDocumentAsState';
import { SelectItem } from 'src/components/form-input';
import { Lens } from 'src/core/lens';
import { Defense, Defenses } from 'src/types/types';
import { AttackRoll } from '../dataSourceData';

const abilityLens = Lens.from<AttackRoll | null, string>(
	(attackRoll) => attackRoll?.attack ?? '',
	(mutator) => (draft) => {
		const attackRoll = mutator(draft?.attack || '');

		if (attackRoll !== '' && draft) {
			draft.attack = attackRoll;
		} else {
			return attackRoll === '' ? undefined : { attack: attackRoll, defense: 'ac' };
		}
	}
);

const defenseLens = Lens.from<AttackRoll | null, Defense>(
	(attackRoll) => attackRoll?.defense ?? 'ac',
	(mutator) => (draft) => {
		if (draft) draft.defense = mutator(draft.defense);
	}
);

const defenseOptions = Defenses.map(
	(ability): SelectItem<Defense> => ({
		key: ability,
		value: ability,
		label: ability.toUpperCase(),
		typeaheadLabel: ability.toUpperCase(),
	})
);

export function AttackRollFields(props: ImmutableStateMutator<AttackRoll | null>) {
	const abilityState = applyLens(props, abilityLens);

	return (
		<div className="grid gap-1 grid-cols-12">
			<FormInput className="col-span-3">
				<FormInput.TextField {...abilityState} />
				<FormInput.Label>Attack Ability</FormInput.Label>
			</FormInput>
			{!props.value ? (
				<></>
			) : (
				<>
					<div className="justify-self-center">vs.</div>
					<FormInput className="col-span-3">
						<FormInput.Select {...applyLens(props, defenseLens)} options={defenseOptions} />
						<FormInput.Label>Defense</FormInput.Label>
					</FormInput>
				</>
			)}
		</div>
	);
}
