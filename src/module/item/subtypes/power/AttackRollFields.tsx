import { FormInput, SelectItem } from 'src/components/form-input';
import { applyLens, ImmutableStateMutator } from 'src/components/form-input/hooks/useDocumentAsState';
import { Lens } from 'src/core/lens';
import { Abilities, Ability, Defense, Defenses } from 'src/types/types';
import { AttackRoll } from './dataSourceData';

const abilityLens = Lens.from<AttackRoll | null, Ability | ''>(
	(attackRoll) => attackRoll?.attackAbility ?? '',
	(mutator) => (draft) => {
		const ability = mutator(draft?.attackAbility || '');

		if (ability !== '' && draft) {
			draft.attackAbility = ability;
		} else {
			return ability === '' ? undefined : { attackAbility: ability, attackModifier: 0, defense: 'ac' };
		}
	}
);

const modifierLens = Lens.from<AttackRoll | null, number>(
	(attackRoll) => attackRoll?.attackModifier ?? 0,
	(mutator) => (draft) => {
		if (draft) draft.attackModifier = mutator(draft.attackModifier);
	}
);

const defenseLens = Lens.from<AttackRoll | null, Defense>(
	(attackRoll) => attackRoll?.defense ?? 'ac',
	(mutator) => (draft) => {
		if (draft) draft.defense = mutator(draft.defense);
	}
);

const abilityOptions = [
	{
		key: '',
		value: '',
		label: 'No Attack',
	} as SelectItem<Ability | ''>,
].concat(
	Abilities.map((ability): SelectItem<Ability | ''> => ({ key: ability, value: ability, label: ability.toUpperCase() }))
);

const defenseOptions = Defenses.map(
	(ability): SelectItem<Defense> => ({ key: ability, value: ability, label: ability.toUpperCase() })
);

export function AttackRollFields(props: ImmutableStateMutator<AttackRoll | null>) {
	const abilityState = applyLens(props, abilityLens);
	// const { value: modifier, onChangeValue: setModifier } = applyLens({ value, onChangeValue: onChange }, modifierLens);

	return (
		<div className="grid gap-1 grid-cols-12">
			<FormInput className="col-span-3">
				<FormInput.Select {...abilityState} options={abilityOptions} />
				<FormInput.Label>Attack Ability</FormInput.Label>
			</FormInput>
			{!props.value ? (
				<></>
			) : (
				<>
					<FormInput className="col-span-3 self-end">
						<FormInput.NumberField {...applyLens(props, modifierLens)} />
						<FormInput.Label>Mod</FormInput.Label>
					</FormInput>
					<div>vs.</div>
					<FormInput className="col-span-3">
						<FormInput.Select {...applyLens(props, defenseLens)} options={defenseOptions} />
						<FormInput.Label>Defense</FormInput.Label>
					</FormInput>
				</>
			)}
		</div>
	);
}
