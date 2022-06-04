import { AnyDocument, SourceDataOf } from 'src/core/foundry';
import { PathName, getFieldValue } from 'src/core/path-typings';
import { useKeyValueWhenBlur } from '../hooks/useKeyValueWhenBlur';

export function Checkbox<TDocument extends AnyDocument>({
	document,
	field,
	...checkboxProps
}: JSX.IntrinsicElements['input'] & {
	document: TDocument;
	field: PathName<SourceDataOf<TDocument>, boolean>;
}) {
	const value = getFieldValue(document.data._source, field);
	const { defaultValue: defaultChecked, ...props } = useKeyValueWhenBlur(value, (v) => (v ? 'true' : 'false'));

	return (
		<input
			type="checkbox"
			name={field}
			{...checkboxProps}
			value={undefined}
			defaultChecked={defaultChecked}
			{...props}
		/>
	);
}
