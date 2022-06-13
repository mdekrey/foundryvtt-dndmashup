import { AnyDocument, SourceDataOf } from 'src/core/foundry';
import { PathName, getFieldValue } from 'src/core/path-typings';
import { useKeyValueWhenBlur } from '../hooks/useKeyValueWhenBlur';

export function AutoCheckbox<TDocument extends AnyDocument>({
	document,
	field,
	...checkboxProps
}: JSX.IntrinsicElements['input'] & {
	document: TDocument;
	field: PathName<SourceDataOf<TDocument>, boolean>;
}) {
	const value = getFieldValue(document.data._source, field);
	// Intentionally ignoring defaultValue
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { defaultValue, ...props } = useKeyValueWhenBlur(value ? 'true' : 'false');

	return (
		<input
			type="checkbox"
			name={field}
			{...checkboxProps}
			value={undefined}
			defaultChecked={value}
			className="mr-1"
			{...props}
		/>
	);
}
