import { cloneDeep } from 'lodash/fp';
import { immerMutatorToMutator } from './immerMutatorToMutator';
import { Stateful } from './types';

export function lensFromState<S>([value, setValue]: [S, React.Dispatch<React.SetStateAction<S>>]): Stateful<S> {
	return {
		value,
		onChangeValue: (mutator) => {
			return setValue((p) => {
				const cloned = cloneDeep(p);
				return immerMutatorToMutator(mutator)(cloned);
			});
		},
	};
}
