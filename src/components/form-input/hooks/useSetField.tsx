import { useCallback } from 'react';
import { AnyDocument, SourceDataOf } from 'src/core/foundry';
import { PathName } from 'src/core/path-typings';

export function useSetField<TDocument extends AnyDocument, TValue>(
	document: TDocument,
	field: PathName<SourceDataOf<TDocument>, TValue>
) {
	return useCallback(
		(value: TValue) => {
			const resultObject = field
				.split('.')
				.reverse()
				.reduce<unknown>((value, segment) => ({ [segment]: value }), value);
			document.update(resultObject as DeepPartial<SourceDataOf<TDocument>>);
		},
		[document, field]
	);
}
