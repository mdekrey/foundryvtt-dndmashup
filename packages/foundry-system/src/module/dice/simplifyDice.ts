import { AbilityTerm } from './AbilityTerm';

export function simplifyDice<D extends object>(expression: string, data?: D) {
	const roll = new Roll(expression, data);

	const finalRoll = Roll.fromTerms(roll.terms.map(simplifyTerm));

	if (finalRoll.isDeterministic) return finalRoll.evaluate({ async: false }).total;

	return finalRoll.formula.replace(/ /g, '');
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
