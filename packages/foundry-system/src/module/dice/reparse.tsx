import { AbilityTerm } from './AbilityTerm';
import { MashupDiceContext } from './MashupDiceContext';
import { WeaponTerm } from './WeaponTerm';

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
