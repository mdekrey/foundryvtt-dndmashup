import produce, { Draft } from 'immer';
import { AnyDocument, SourceDataOf } from 'src/core/foundry';
import { SimpleDocument, SimpleDocumentData } from 'dndmashup-react/core/interfaces/simple-document';
import { ImmerMutator, Lens } from 'src/core/lens';

export type ImmutableMutatorOptions = { deleteData: boolean };
export type ImmutableMutator<T> = (mutator: ImmerMutator<T>, config?: Partial<ImmutableMutatorOptions>) => void;

export type ImmutableStateMutator<T> = { value: T; onChangeValue: ImmutableMutator<T> };
export type Stateful<T> = ImmutableStateMutator<T>;

export function documentAsState<TDocument extends AnyDocument>(
	document: TDocument,
	options?: Partial<ImmutableMutatorOptions>
): Stateful<SourceDataOf<TDocument>>;
export function documentAsState<TData>(
	document: SimpleDocument<TData>,
	options?: Partial<ImmutableMutatorOptions>
): Stateful<SimpleDocumentData<TData>>;
export function documentAsState(
	document: AnyDocument | SimpleDocument,
	options: Partial<ImmutableMutatorOptions> = {}
): Stateful<any> {
	return {
		value: '_source' in document.data ? document.data._source : document.data,
		onChangeValue: (mutator, options2 = {}) => {
			const { deleteData = true } = { ...options, ...options2 };
			const result = produce(
				'_source' in document.data ? document.data._source : document.data,
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
