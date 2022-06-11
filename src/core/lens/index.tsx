import { Draft } from 'immer';

export type ImmerMutator<T> = (draft: Draft<T>) => T | undefined | void;
export type Mutator<T> = (draft: Draft<T>) => T | Draft<T>;

export class Lens<TSource, TValue> {
	constructor(
		public readonly getValue: (source: TSource) => TValue,
		public readonly produce: {
			(source: Draft<TSource>, mutator: ImmerMutator<TValue>): void;
			(mutator: ImmerMutator<TValue>): ImmerMutator<TSource>;
		}
	) {}

	combine<TFinalValue>(second: Lens<TValue, TFinalValue>): Lens<TSource, TFinalValue> {
		const thisProduce = this.produce;
		function produce(source: Draft<TSource>, mutator: ImmerMutator<TFinalValue>): void;
		function produce(mutator: ImmerMutator<TFinalValue>): ImmerMutator<TSource>;
		function produce(...params: [Draft<TSource>, ImmerMutator<TFinalValue>] | [ImmerMutator<TFinalValue>]) {
			if (params.length === 1) {
				const [mutator] = params;
				return thisProduce(second.produce(mutator));
			} else {
				const [source, mutator] = params;
				return thisProduce(second.produce(mutator))(source);
			}
		}

		return new Lens<TSource, TFinalValue>((source) => second.getValue(this.getValue(source)), produce);
	}

	static from<TSource, TValue>(
		getValue: Lens<TSource, TValue>['getValue'],
		setValue: (mutator: ImmerMutator<TValue>) => ImmerMutator<TSource>
	): Lens<TSource, TValue> {
		function produce(source: Draft<TSource>, mutator: ImmerMutator<TValue>): void;
		function produce(mutator: ImmerMutator<TValue>): ImmerMutator<TSource>;
		function produce(...params: [Draft<TSource>, ImmerMutator<TValue>] | [ImmerMutator<TValue>]) {
			if (params.length === 1) {
				const [mutator] = params;
				return setValue(mutator);
			} else {
				const [source, mutator] = params;
				return setValue(mutator)(source);
			}
		}

		return new Lens<TSource, TValue>(getValue, produce);
	}
}
