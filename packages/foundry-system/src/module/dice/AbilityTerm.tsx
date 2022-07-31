import { abilities, Ability } from '../../core/foundry';
import { MashupDiceContext } from './MashupDiceContext';

export class AbilityTerm extends NumericTerm {
	static override REGEXP = new RegExp(`^(${abilities.join('|')})${RollTerm.FLAVOR_REGEXP_STRING}?$`, 'i');
	private ability: Ability;
	static override SERIALIZE_ATTRIBUTES = ['number', 'ability'];

	constructor({ ability, ...props }: ConstructorParameters<ConstructorOf<typeof NumericTerm>> & { ability: Ability }) {
		super(props);
		this.ability = ability;
	}

	override get expression() {
		return this.ability.toUpperCase();
	}

	static override fromMatch(match: RegExpMatchArray, data?: MashupDiceContext) {
		if (!data) {
			return null as never as AbilityTerm;
		}

		const [parsedAbility, flavor] = match.slice(1);
		const ability = parsedAbility.toLowerCase() as Ability;
		const abilityTotal = data.actor.derivedData.abilities[ability].total;

		return new AbilityTerm({ number: abilityTotal, ability, options: { flavor } });
	}
}
