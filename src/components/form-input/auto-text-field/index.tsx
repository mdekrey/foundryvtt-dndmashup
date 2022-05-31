import { useCallback } from 'react';
import { AnyDocument, SourceDataOf } from 'src/core/foundry';
import { PathName, getFieldValue } from 'src/core/path-typings';
import { Field } from '../field';
import { useControlledField } from '../hooks/useControlledField';
import { useSetField } from '../hooks/useSetField';

export function AutoTextField<TDocument extends AnyDocument>({
	document,
	className,
	field,
}: {
	document: TDocument;
	className?: string;
	field: PathName<SourceDataOf<TDocument>, string>;
}) {
	const [value, setValue] = useControlledField(getFieldValue(document.data._source, field));
	const setField = useSetField<TDocument, string>(document, field);

	const handleChange = useCallback(
		(target: HTMLInputElement) => {
			setValue(target.value);
			setField(target.value);
		},
		[document, field, setField]
	);

	return (
		<Field>
			<input type="text" value={value} onChange={(ev) => handleChange(ev.target)} className={className} />
		</Field>
	);
}
