import { useCallback } from 'react';
import produce from 'immer';
import { AnyDocument, SourceDataOf } from 'src/core/foundry';
import { ImmerMutator, Lens } from 'src/core/lens';

export type ImmutableMutatorOptions = { deleteData: boolean };
export type ImmutableMutator<T> = (mutator: ImmerMutator<T>, config?: Partial<ImmutableMutatorOptions>) => void;

export type ImmutableStateMutator<T> = [T, ImmutableMutator<T>];

export function useDocumentAsState<TDocument extends AnyDocument>(
	document: TDocument
): ImmutableStateMutator<SourceDataOf<TDocument>> {
	return [
		document.data._source,
		useCallback<ImmutableMutator<SourceDataOf<TDocument>>>(
			(mutator, { deleteData = true } = {}) => {
				const result = produce(document.data._source, mutator);
				document.update(result, { overwrite: true, diff: !deleteData, recursive: !deleteData });
			},
			[document]
		),
	];
}

export function applyLens<TInput, TOutput>(
	[state, mutator]: ImmutableStateMutator<TInput>,
	lens: Lens<TInput, TOutput>
): ImmutableStateMutator<TOutput> {
	return [
		lens.getValue(state),
		(innerMutator, options) => {
			const actualMutator = lens.produce(innerMutator);
			mutator(actualMutator, options);
		},
	];
}
