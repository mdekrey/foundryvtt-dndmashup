import { AbilityTerm } from './AbilityTerm';
import { MashupDiceContext } from './MashupDiceContext';
import { WeaponTerm } from './WeaponTerm';

export function reparse(term: StringTerm | NumericTerm | ParentheticalTerm, data: MashupDiceContext): RollTerm {
	if (term instanceof ParentheticalTerm) {
		if (term.roll || term instanceof WeaponTerm) return term;
		return new ParentheticalTerm({ term: term.term, roll: Roll.create(term.term, data), options: term.options });
	}
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
