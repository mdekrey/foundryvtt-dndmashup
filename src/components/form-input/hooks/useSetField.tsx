/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';
import produce from 'immer';
import { AnyDocument, SourceDataOf } from 'src/core/foundry';
import { PathName } from 'src/core/path-typings';

export function useSetField<TDocument extends AnyDocument, TValue>(
	document: TDocument,
	field: PathName<SourceDataOf<TDocument>, TValue>
) {
	return useCallback(
		(value: TValue, { deleteData } = { deleteData: false }) => {
			const result = produce((draft) => {
				const segments = field.split('.');
				const resultDraft: any = segments
					.slice(0, segments.length - 1)
					.reduce<unknown>((target, segment) => (target as any)[segment], draft);
				resultDraft[segments[segments.length - 1]] = value;

				Object.keys(draft)
					.filter((k) => k !== segments[0])
					.forEach((k) => {
						delete draft[k];
					});
			})(document.data._source);
			console.log(result);
			document.update({ ...result }, { overwrite: true, diff: !deleteData, recursive: !deleteData });
		},
		[document, field]
	);
}
