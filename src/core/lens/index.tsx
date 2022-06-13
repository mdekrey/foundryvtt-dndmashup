import { Draft } from 'immer';

export type ImmerMutator<T> = (draft: Draft<T>) => T | undefined | void;
export type Mutator<T> = (draft: Draft<T>) => T | Draft<T>;

function immerMutatorToMutator<T>(m: ImmerMutator<T>): Mutator<T> {
	return (draft) => {
		const result = m(draft);
		return result === undefined ? draft : result;
	};
}

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
		setValue: (mutator: Mutator<TValue>) => ImmerMutator<TSource>
	): Lens<TSource, TValue> {
		function produce(source: Draft<TSource>, mutator: ImmerMutator<TValue>): void;
		function produce(mutator: ImmerMutator<TValue>): ImmerMutator<TSource>;
		function produce(...params: [Draft<TSource>, ImmerMutator<TValue>] | [ImmerMutator<TValue>]) {
			if (params.length === 1) {
				const [mutator] = params;
				return setValue(immerMutatorToMutator(mutator));
			} else {
				const [source, mutator] = params;
				return setValue(immerMutatorToMutator(mutator))(source);
			}
		}

		return new Lens<TSource, TValue>(getValue, produce);
	}

	static fromProp<TSource, P extends keyof TSource>(prop: P): Lens<TSource, TSource[P]> {
		type TValue = TSource[P];
		function produce(source: Draft<TSource>, mutator: ImmerMutator<TValue>): void;
		function produce(mutator: ImmerMutator<TValue>): ImmerMutator<TSource>;
		function produce(...params: [Draft<TSource>, ImmerMutator<TValue>] | [ImmerMutator<TValue>]) {
			if (params.length === 1) {
				const [mutator] = params;
				return (draft: Draft<TSource>) => {
					draft[prop as keyof Draft<TSource>] = (mutator(draft[prop as keyof Draft<TSource>] as Draft<TValue>) ??
						draft[prop as keyof Draft<TSource>]) as Draft<TSource>[keyof Draft<TSource>];
				};
			} else {
				const [source, mutator] = params;
				source[prop as keyof Draft<TSource>] = (mutator(source[prop as keyof Draft<TSource>] as Draft<TValue>) ??
					source[prop as keyof Draft<TSource>]) as Draft<TSource>[keyof Draft<TSource>];
				return;
			}
		}

		return new Lens<TSource, TValue>((source) => source[prop], produce);
	}
}
