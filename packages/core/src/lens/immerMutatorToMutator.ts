import { ImmerMutator, Mutator } from './types';

export function immerMutatorToMutator<T>(m: ImmerMutator<T>): Mutator<T> {
	return (draft) => {
		const result = m(draft);
		return result === undefined ? draft : result;
	};
}
