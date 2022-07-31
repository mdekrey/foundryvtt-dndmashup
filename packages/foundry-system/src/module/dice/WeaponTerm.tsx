import { isNil } from 'lodash/fp';
import { MashupDiceContext } from './MashupDiceContext';

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

	override isIntermediate = true;

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
