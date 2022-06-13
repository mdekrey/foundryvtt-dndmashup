import produce from 'immer';
import { AnyDocument, SourceDataOf } from 'src/core/foundry';
import { ImmerMutator, Lens } from 'src/core/lens';

export type ImmutableMutatorOptions = { deleteData: boolean };
export type ImmutableMutator<T> = (mutator: ImmerMutator<T>, config?: Partial<ImmutableMutatorOptions>) => void;

export type ImmutableStateMutator<T> = { value: T; onChangeValue: ImmutableMutator<T> };

export function documentAsState<TDocument extends AnyDocument>(
	document: TDocument
): ImmutableStateMutator<SourceDataOf<TDocument>> {
	return {
		value: document.data._source,
		onChangeValue: (mutator, { deleteData = true } = {}) => {
			const result = produce(document.data._source, mutator);
			document.update(result, { overwrite: true, diff: !deleteData, recursive: !deleteData });
		},
	};
}

export function applyLens<TInput, TOutput>(
	{ value: state, onChangeValue: mutator }: ImmutableStateMutator<TInput>,
	lens: Lens<TInput, TOutput>
): ImmutableStateMutator<TOutput> {
	return {
		value: lens.getValue(state),
		onChangeValue: (innerMutator, options) => {
			const actualMutator = lens.produce(innerMutator);
			mutator(actualMutator, options);
		},
	};
}

export function setWith<TInput, TOutput>(
	setter: ImmutableMutator<TInput>,
	lens: Lens<TInput, TOutput>,
	value: TOutput,
	config?: Partial<ImmutableMutatorOptions>
) {
	const actualMutator = lens.produce(() => value);
	setter(actualMutator, config);
}
