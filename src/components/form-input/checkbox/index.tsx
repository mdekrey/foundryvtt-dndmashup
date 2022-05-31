import { AnyDocument, SourceDataOf } from 'src/core/foundry';
import { PathName, getFieldValue } from 'src/core/path-typings';
import { useDocument } from '../../sheet/framework';

export function Checkbox<TDocument extends AnyDocument>({
	field,
	...checkboxProps
}: JSX.IntrinsicElements['input'] & { field: PathName<SourceDataOf<TDocument>, boolean> }) {
	const document = useDocument<TDocument>();

	const defaultValue: boolean = getFieldValue(document.data._source, field);

	return <input type="checkbox" {...checkboxProps} value={undefined} name={field} defaultChecked={defaultValue} />;
}
