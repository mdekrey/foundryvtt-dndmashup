import { AnyDocument } from 'src/core/foundry';
import { PathName } from 'src/core/path-typings';
import { useDocument } from '../../sheet/framework';

type SafeDocumentData<TDocument extends AnyDocument> = Pick<TDocument['data'], 'name' | 'data'>;

export function Checkbox<TDocument extends AnyDocument>({
	field,
	...checkboxProps
}: JSX.IntrinsicElements['input'] & { field: PathName<SafeDocumentData<TDocument>, boolean> }) {
	const document = useDocument<TDocument>();

	const defaultValue: boolean = field.split('.').reduce((prev, f) => prev[f], document.data);

	return <input type="checkbox" {...checkboxProps} value={undefined} name={field} defaultChecked={defaultValue} />;
}
