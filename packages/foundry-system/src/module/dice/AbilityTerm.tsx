import { abilities, Ability } from '@foundryvtt-dndmashup/mashup-rules';
import { MashupDiceContext } from './MashupDiceContext';

export class AbilityTerm extends NumericTerm {
	static override REGEXP = new RegExp(`^(${abilities.join('|')})${RollTerm.FLAVOR_REGEXP_STRING}?$`, 'i');
	private ability: Ability;
	static override SERIALIZE_ATTRIBUTES = ['number', 'ability'];

	override isIntermediate = true;

	constructor({ ability, ...props }: ConstructorParameters<ConstructorOf<typeof NumericTerm>> & { ability: Ability }) {
		super(props);
		this.ability = ability;
	}

	override get expression() {
		return this.ability.toUpperCase();
	}

	get dice() {
		return [this];
	}

	getTooltipData() {
		return {
			formula: this.expression,
			total: this.total,
			flavor: this.flavor,
			rolls: [],
		};
	}

	static override fromMatch(match: RegExpMatchArray, data?: MashupDiceContext) {
		if (!data || !data.actor) {
			return null as never as AbilityTerm;
		}

		const [parsedAbility, flavor] = match.slice(1);
		const ability = parsedAbility.toLowerCase() as Ability;
		const abilityTotal = data.actor.derivedCache.bonuses.getValue(`ability-${ability}`);

		return new AbilityTerm({ number: abilityTotal, ability, options: { flavor } });
	}
}
