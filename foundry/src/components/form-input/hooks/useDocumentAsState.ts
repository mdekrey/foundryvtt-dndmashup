import produce, { Draft } from 'immer';
import { SimpleDocument, SimpleDocumentData } from 'dndmashup-react/core/interfaces/simple-document';
import { ImmutableMutator, ImmutableMutatorOptions, Lens, Stateful } from 'dndmashup-react/core/lens';

export function documentAsState<TData>(
	document: SimpleDocument<TData>,
	options: Partial<ImmutableMutatorOptions> = {}
): Stateful<SimpleDocumentData<TData>> {
	return {
		value: '_source' in document.data ? (document.data as any)._source : document.data,
		onChangeValue: (mutator, options2 = {}) => {
			const { deleteData = true } = { ...options, ...options2 };
			const result = produce(
				'_source' in document.data ? (document.data as any)._source : document.data,
				(draft: Draft<any>) => {
					delete draft._id;
					return mutator(draft);
				}
			) as any;
			document.update(result, { overwrite: true, diff: !deleteData, recursive: !deleteData });
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
