import { useCallback, useRef } from 'react';
import { AnyDocument } from 'src/core/foundry';
import { PathName } from 'src/core/path-typings';
import { Field } from '../field';

type SafeDocumentData<TDocument extends AnyDocument> = Pick<TDocument['data'], 'name' | 'data'>;

export function AutoTextField<TDocument extends AnyDocument>({
	document,
	className,
	field,
}: {
	document: TDocument;
	className?: string;
	field: PathName<SafeDocumentData<TDocument>, string>;
}) {
	const actualValue = useRef(['', '']);
	const dataValue: string = field.split('.').reduce((prev, f) => prev[f], document.data);
	if (actualValue.current[0] !== dataValue) {
		actualValue.current = [dataValue, dataValue];
	}
	const value = actualValue.current[1];

	const handleChange = useCallback(
		(target: HTMLInputElement) => {
			actualValue.current[1] = target.value;
			const resultObject = field
				.split('.')
				.reverse()
				.reduce<unknown>((value, segment) => ({ [segment]: value }), target.value);
			document.update(resultObject as DeepPartial<SafeDocumentData<TDocument>>);
		},
		[document, field]
	);

	return (
		<Field>
			<input type="text" value={value} onChange={(ev) => handleChange(ev.target)} className={className} />
		</Field>
	);
}
