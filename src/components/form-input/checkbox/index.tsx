import { AnyDocument, SourceDataOf } from 'src/core/foundry';
import { PathName, getFieldValue } from 'src/core/path-typings';

export function Checkbox<TDocument extends AnyDocument>({
	document,
	field,
	...checkboxProps
}: JSX.IntrinsicElements['input'] & { document: TDocument; field: PathName<SourceDataOf<TDocument>, boolean> }) {
	const defaultValue: boolean = getFieldValue(document.data._source, field);

	return <input type="checkbox" {...checkboxProps} value={undefined} name={field} defaultChecked={defaultValue} />;
}
