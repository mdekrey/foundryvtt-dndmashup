import { getFieldValue, PathName } from 'src/core/path-typings';
import { AnyDocument, SourceDataOf } from 'src/core/foundry';
import { useDocument } from '../../sheet/framework';
import { Field } from '../field';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AutoNumberField<TDocument extends AnyDocument>({
	className,
	field,
}: {
	className?: string;
	field: PathName<SourceDataOf<TDocument>, number>;
}) {
	const document = useDocument<TDocument>();

	const defaultValue = getFieldValue(document.data._source, field);
	return (
		<Field>
			<input type="number" name={field} defaultValue={defaultValue ?? ''} className={className} data-dtype="Number" />
		</Field>
	);
}
