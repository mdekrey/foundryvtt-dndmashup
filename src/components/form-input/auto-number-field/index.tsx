import { getFieldValue, PathName } from 'src/core/path-typings';
import { AnyDocument, SourceDataOf } from 'src/core/foundry';
import { Field } from '../field';

export function AutoNumberField<TDocument extends AnyDocument>({
	document,
	className,
	field,
}: {
	document: TDocument;
	className?: string;
	field: PathName<SourceDataOf<TDocument>, number>;
}) {
	const defaultValue = getFieldValue(document.data._source, field);
	return (
		<Field>
			<input type="number" name={field} defaultValue={defaultValue ?? ''} className={className} data-dtype="Number" />
		</Field>
	);
}
