import { isMashupDiceContext } from './isMashupDiceContext';
import { reparse } from './reparse';

export const parseWrapper: LibWrapperWrapperFunction<(formula: string, data: unknown) => RollTerm[]> = (
	wrapper,
	formula,
	data
) => {
	const result = wrapper(formula, data);
	// TODO - recurse parameters
	return result.map((term) =>
		(term instanceof StringTerm || term instanceof NumericTerm) && isMashupDiceContext(data)
			? reparse(term, data)
			: term
	);
};
