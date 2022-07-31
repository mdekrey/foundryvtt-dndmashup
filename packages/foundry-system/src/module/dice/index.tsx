import { isNil } from 'lodash/fp';
import { abilities, Ability, ActorDocument, EquipmentDocument } from '../../core/foundry';

export type MashupDiceContext = { item?: EquipmentDocument; actor: ActorDocument };
function isMashupDiceContext(data?: unknown): data is MashupDiceContext {
	return 'actor' in (data as Record<string, unknown>);
}

export const parseWrapper: LibWrapperWrapperFunction<(formula: string, data: unknown) => RollTerm[]> = (
	wrapper,
	formula,
	data
) => {
	const result = wrapper(formula, data);
	return result.map((term) =>
		(term instanceof StringTerm || term instanceof NumericTerm) && isMashupDiceContext(data)
			? reparse(term, data)
			: term
	);
};

export function reparse(term: StringTerm | NumericTerm, data: MashupDiceContext): RollTerm {
	const result = tryParse(WeaponTerm) ?? tryParse(AbilityTerm) ?? term;
	return result;

	function tryParse<T extends RollTerm>(
		target: ConstructorOf<T> & { REGEXP: RegExp; fromMatch(match: RegExpMatchArray, data: MashupDiceContext): T | null }
	) {
		const match = target.REGEXP.exec(term.formula);
		if (match) return target.fromMatch(match, data);
		return null;
	}
}

export class WeaponTerm extends ParentheticalTerm {
	static override REGEXP = new RegExp(
		`^([0-9]+(?:\\.[0-9]+)?)?(?:\\[([BW])\\])${RollTerm.FLAVOR_REGEXP_STRING}?$`,
		'i'
	);
	private number: undefined | number;
	private weaponCode: string;
	private weaponDice: string;
	private _total: RollTerm['total'];
	static override SERIALIZE_ATTRIBUTES = ['number', 'weaponCode', 'weaponDice', '_total'];

	override isIntermediate = false;

	constructor({
		number,
		weaponDice,
		weaponCode,
		_total,
		options,
	}: {
		number: undefined | number;
		weaponDice: string;
		weaponCode: string;
		_total?: number;
		options: RollTerm.Options;
	}) {
		super({ term: !isNil(number) ? `${number}*(${weaponDice})` : weaponDice, roll: undefined as never, options });
		this._total = _total;
		this._evaluated = !isNil(_total);
		this.number = number;
		this.weaponCode = weaponCode;
		this.weaponDice = weaponDice;
	}

	override get total() {
		return this._total ?? super.total;
	}

	protected override async _evaluate(props?: { minimize?: boolean; maximize?: boolean }): Promise<this> {
		const result = await super._evaluate(props);
		this._total = this.total;
		return result;
	}

	protected override _evaluateSync(props?: { minimize?: boolean; maximize?: boolean }): this {
		const result = super._evaluateSync(props);
		this._total = this.total;
		return result;
	}

	override get expression() {
		return !isNil(this.number) ? `${this.number}[${this.weaponCode}]` : `[${this.weaponCode}]`;
	}

	static fromMatch(match: RegExpMatchArray, data?: MashupDiceContext) {
		const [number, weaponCode, flavor] = match.slice(1);

		// TODO: look up weaponcode using data
		const weaponDice = weaponCode === 'W' ? '1d8' : '1d10';
		// if (!data?.item) {
		// 	return null;
		// }
		return new WeaponTerm({
			number: number ? Number(number) : undefined,
			weaponDice,
			weaponCode: weaponCode,
			options: { flavor },
		});
	}
}

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
