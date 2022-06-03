import { useCallback } from 'react';
import { AnyDocument, SourceDataOf } from 'src/core/foundry';
import { PathName, getFieldValue } from 'src/core/path-typings';
import { useControlledField } from '../hooks/useControlledField';
import { useSetField } from '../hooks/useSetField';

export function Checkbox<TDocument extends AnyDocument>({
	document,
	field,
	...checkboxProps
}: JSX.IntrinsicElements['input'] & {
	document: TDocument;
	field: PathName<SourceDataOf<TDocument>, boolean>;
}) {
	const [value, setValue] = useControlledField(getFieldValue(document.data._source, field));
	const setField = useSetField(document, field);

	const handleChange = useCallback(
		(target: HTMLInputElement) => {
			setValue(target.checked);
			setField(target.checked);
		},
		[document, field, setField]
	);

	return (
		<input
			type="checkbox"
			{...checkboxProps}
			value={undefined}
			onChange={document.isOwner ? (ev) => handleChange(ev.currentTarget) : undefined}
			checked={value}
		/>
	);
}
