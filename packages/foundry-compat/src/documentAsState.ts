import { SimpleDocument, SimpleDocumentData } from './interfaces';
import { ImmutableMutator, ImmutableMutatorOptions, Lens, Stateful } from '@foundryvtt-dndmashup/mashup-core';
import { cloneDeep } from 'lodash/fp';

function documentDataSource<TData>(document: SimpleDocument<TData>): SimpleDocumentData<TData> {
	return '_source' in document.data ? (document.data as any)._source : document.data;
}

export function documentAsState<TData>(
	document: SimpleDocument<TData>,
	options: Partial<ImmutableMutatorOptions> = {}
): Stateful<SimpleDocumentData<TData>> {
	return {
		value: documentDataSource(document),
		onChangeValue: (mutator, options2 = {}) => {
			const { deleteData = true } = { ...options, ...options2 };
			const draft: any = cloneDeep(documentDataSource(document));
			delete draft._id;
			let result = mutator(draft);
			if (result === undefined) result = draft;
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
