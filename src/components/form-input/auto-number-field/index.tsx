import { getFieldValue, PathNameNoArrays } from 'src/core/path-typings';
import { AnyDocument, SourceDataOf } from 'src/core/foundry';
import { Field } from '../field';

export function AutoNumberField<TDocument extends AnyDocument>({
	document,
	className,
	field,
	plain,
}: {
	document: TDocument;
	className?: string;
	field: PathNameNoArrays<SourceDataOf<TDocument>, number>;
	plain?: boolean;
}) {
	const defaultValue = getFieldValue(document.data._source, field);

	const input = (
		<input type="number" name={field} defaultValue={defaultValue ?? ''} className={className} data-dtype="Number" />
	);
	return plain ? input : <Field>{input}</Field>;
}
