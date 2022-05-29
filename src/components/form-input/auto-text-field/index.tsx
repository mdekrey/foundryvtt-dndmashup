import { AnyDocument } from 'src/core/foundry';
import { PathName } from 'src/core/path-typings';
import { useDocument } from '../../sheet/framework';
import { Field } from '../field';

type SafeDocumentData<TDocument extends AnyDocument> = Pick<TDocument['data'], 'name' | 'data'>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AutoTextField<TDocument extends AnyDocument>({
	className,
	field,
}: {
	className?: string;
	field: PathName<SafeDocumentData<TDocument>, string>;
}) {
	const document = useDocument<TDocument>();

	const defaultValue: string = field.split('.').reduce((prev, f) => prev[f], document.data);
	return (
		<Field>
			<input type="text" name={field} defaultValue={defaultValue ?? ''} className={className} />
		</Field>
	);
}
