import { PathName } from 'src/core/path-typings';
import { AnyDocument } from 'src/core/foundry';
import { useDocument } from '../../sheet/framework';
import { Field } from '../field';

type SafeDocumentData<TDocument extends AnyDocument> = Pick<TDocument['data'], 'name' | 'data'>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AutoNumberField<TDocument extends AnyDocument>({
	className,
	field,
}: {
	className?: string;
	field: PathName<SafeDocumentData<TDocument>, number>;
}) {
	const document = useDocument<TDocument>();

	const defaultValue: string = field.split('.').reduce((prev, f) => prev[f], document.data);
	return (
		<Field>
			<input type="number" name={field} defaultValue={defaultValue ?? ''} className={className} data-dtype="Number" />
		</Field>
	);
}
