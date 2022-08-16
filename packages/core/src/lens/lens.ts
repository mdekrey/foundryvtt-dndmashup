import { cloneDeep } from 'lodash/fp';
import { immerMutatorToMutator } from './immerMutatorToMutator';
import { ImmerMutator, Mutator, Stateful } from './types';

export class Lens<TSource, TValue> {
	constructor(
		public readonly getValue: (source: TSource) => TValue,
		public readonly produce: {
			(source: TSource, mutator: ImmerMutator<TValue>): void;
			(mutator: ImmerMutator<TValue>): ImmerMutator<TSource>;
		}
	) {}

	combine<TFinalValue>(second: Lens<TValue, TFinalValue>): Lens<TSource, TFinalValue> {
		const thisProduce = this.produce;
		function produce(source: TSource, mutator: ImmerMutator<TFinalValue>): void;
		function produce(mutator: ImmerMutator<TFinalValue>): ImmerMutator<TSource>;
		function produce(...params: [TSource, ImmerMutator<TFinalValue>] | [ImmerMutator<TFinalValue>]) {
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

	to<TFinalValue>(
		getValue: Lens<TValue, TFinalValue>['getValue'],
		setValue: (mutator: Mutator<TFinalValue>) => ImmerMutator<TValue>
	): Lens<TSource, TFinalValue> {
		return this.combine(Lens.from<TValue, TFinalValue>(getValue, setValue));
	}

	toField<TProp extends keyof TValue>(field: TProp) {
		return this.combine(makeFieldLens<TValue, TProp>(field));
	}

	default(
		value: NonNullable<TValue>,
		predicate?: (value: NonNullable<TValue>) => boolean
	): Lens<TSource, NonNullable<TValue>>;
	default<TOther>(
		value: TOther,
		predicate: (value: NonNullable<TValue> | TOther) => value is TOther
	): Lens<TSource, NonNullable<TValue> | TOther>;
	default<TOther>(
		value: TOther | NonNullable<TValue>,
		predicate?: (value: NonNullable<TValue> | TOther) => boolean
	): Lens<TSource, NonNullable<TValue> | TOther> {
		return this.combine(
			Lens.from<TValue, NonNullable<TValue> | TOther>(
				(source) => source ?? value,
				(mutator) => (draft) => {
					const result =
						draft === null || draft === undefined ? mutator(cloneDeep(value) as any) : mutator(draft as any);
					if (predicate?.(result)) return null as never as TValue;
					return result === undefined ? draft : (result as never);
				}
			)
		);
	}

	static identity<T>(): Lens<T, T> {
		return Lens.from<T, T>(
			(p) => p,
			(mutator) => (p) => {
				return mutator(p);
			}
		);
	}

	static from<TSource, TValue>(
		getValue: Lens<TSource, TValue>['getValue'],
		setValue: (mutator: Mutator<TValue>) => ImmerMutator<TSource>
	): Lens<TSource, TValue> {
		function produce(source: TSource, mutator: ImmerMutator<TValue>): void;
		function produce(mutator: ImmerMutator<TValue>): ImmerMutator<TSource>;
		function produce(...params: [TSource, ImmerMutator<TValue>] | [ImmerMutator<TValue>]) {
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

	static cast<TSource, TValue extends TSource>(): Lens<TSource, TValue>;
	static cast<TSource extends TValue, TValue>(): Lens<TSource, TValue>;
	static cast<TSource, TValue>() {
		return Lens.from<TSource, TValue>(
			(attackEffect) => attackEffect as any,
			(mutator) => (draft) => {
				return mutator(draft as any) as any;
			}
		);
	}

	static fromProp<TSource>(): <P extends keyof TSource>(prop: P) => Lens<TSource, TSource[P]>;
	static fromProp<TSource, P extends keyof TSource>(prop: P): Lens<TSource, TSource[P]>;
	static fromProp<TSource, P extends keyof TSource>(
		prop?: P
	): ((prop: P) => Lens<TSource, TSource[P]>) | Lens<TSource, TSource[P]> {
		function buildLens(prop: P): Lens<TSource, TSource[P]> {
			type TValue = TSource[P];
			function produce(source: TSource, mutator: ImmerMutator<TValue>): void;
			function produce(mutator: ImmerMutator<TValue>): ImmerMutator<TSource>;
			function produce(...params: [TSource, ImmerMutator<TValue>] | [ImmerMutator<TValue>]) {
				if (params.length === 1) {
					const [mutator] = params;
					return (draft: TSource) => {
						draft[prop] = immerMutatorToMutator(mutator)(draft[prop]);
					};
				} else {
					const [source, mutator] = params;
					source[prop] = immerMutatorToMutator(mutator)(source[prop]);
					return;
				}
			}

			return new Lens<TSource, TValue>((source) => source[prop], produce);
		}

		if (prop === undefined) return (prop: P) => buildLens(prop);
		return buildLens(prop);
	}

	apply(state: Stateful<TSource>): Stateful<TValue> {
		return {
			value: this.getValue(state.value),
			onChangeValue: (innerMutator, options) => {
				const actualMutator = this.produce(innerMutator);
				state.onChangeValue(actualMutator, options);
			},
		};
	}
}

export function makeFieldLens<TTarget, TProp extends keyof TTarget>(field: TProp) {
	return Lens.from<TTarget, TTarget[TProp]>(
		(data) => data[field],
		(mutator) => (data) => {
			data[field] = mutator(data[field]);
		}
	);
}
