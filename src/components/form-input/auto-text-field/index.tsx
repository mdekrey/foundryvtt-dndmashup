import { AnyDocument, SourceDataOf } from 'src/core/foundry';
import { PathName, getFieldValue } from 'src/core/path-typings';
import { Field } from '../field';
import { useKeyValueWhenBlur } from '../hooks/useKeyValueWhenBlur';

export function AutoTextField<TDocument extends AnyDocument>({
	document,
	className,
	field,
	plain,
}: {
	document: TDocument;
	className?: string;
	field: PathName<SourceDataOf<TDocument>, string>;
	plain?: boolean;
}) {
	const value = getFieldValue(document.data._source, field);

	const input = (
		<input
			type="text"
			readOnly={!document.isOwner}
			name={field}
			{...useKeyValueWhenBlur(value)}
			className={className}
		/>
	);

	return plain ? input : <Field>{input}</Field>;
}
