import { Lens } from './index';

export function makeFieldLens<TTarget, TProp extends keyof TTarget>(field: TProp) {
	return Lens.from<TTarget, TTarget[TProp]>(
		(data) => data[field],
		(mutator) => (data) => {
			(data as any)[field] = mutator((data as any)[field]);
		}
	);
}
