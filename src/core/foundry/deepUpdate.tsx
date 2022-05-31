import produce, { Draft } from 'immer';
import { AnyDocument, SourceDataOf } from './types';

export function deepUpdate<T extends AnyDocument>(
	document: T,
	mutator: (state: Draft<SourceDataOf<T>>, initialState: SourceDataOf<T>) => void
) {
	const result = produce<SourceDataOf<T>>((draft, s) => {
		mutator(draft, s);
	})(document.data._source);
	const changes = Object.keys(result).reduce((prev, next) => {
		if (result[next as keyof typeof result] !== document.data._source[next as keyof typeof result])
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(prev as any)[next] = result[next as keyof typeof result];
		return prev;
	}, {} as Partial<typeof result>);
	document.update(changes, { overwrite: true, diff: false, recursive: false });
}
