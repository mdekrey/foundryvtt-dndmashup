import { AbilityTerm } from './AbilityTerm';

export function simplifyDice<D extends object>(expression: string, data?: D) {
	const roll = new Roll(expression, data);

	return Roll.fromTerms(roll.terms.map(simplifyTerm)).formula.trim();
}

function simplifyTerm(term: RollTerm): RollTerm {
	if (term instanceof ParentheticalTerm) {
		return ParentheticalTerm.fromTerms(term.roll.terms.map(simplifyTerm));
	} else if (term instanceof AbilityTerm) {
		return new NumericTerm({ number: term.number });
	} else {
		return term;
	}
}
