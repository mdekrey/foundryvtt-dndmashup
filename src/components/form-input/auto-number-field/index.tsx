import { getFieldValue, PathName } from 'src/core/path-typings';
import { AnyDocument, SourceDataOf } from 'src/core/foundry';
import { Field } from '../field';
import { useKeyValueWhenBlur } from '../hooks/useKeyValueWhenBlur';

export function AutoNumberField<TDocument extends AnyDocument>({
	document,
	className,
	field,
	plain,
}: {
	document: TDocument;
	className?: string;
	field: PathName<SourceDataOf<TDocument>, number>;
	plain?: boolean;
}) {
	const value = getFieldValue(document.data._source, field);

	const input = (
		<input
			type="number"
			readOnly={!document.isOwner}
			name={field}
			{...useKeyValueWhenBlur(value)}
			className={className}
			data-dtype="Number"
		/>
	);
	return plain ? input : <Field>{input}</Field>;
}
