import { ReactNode, Key } from 'react';
import { getFieldValue, PathName } from 'src/core/path-typings';
import { AnyDocument, SourceDataOf } from 'src/core/foundry';
import { Field } from '../field';
import { useKeyValueWhenBlur } from '../hooks/useKeyValueWhenBlur';

export type SelectItem<TValue> = {
	value: TValue;
	key: Key;
	label: ReactNode;
};

export function AutoSelect<TDocument extends AnyDocument, TValue extends string | number>({
	document,
	className,
	field,
	plain,
	options,
}: {
	document: TDocument;
	className?: string;
	field: PathName<SourceDataOf<TDocument>, TValue>;
	plain?: boolean;
	options: SelectItem<TValue>[];
}) {
	const value = getFieldValue<SourceDataOf<TDocument>, TValue>(document.data._source, field);
	const keyedValue = options.find((e) => e.value === value)?.key ?? '';

	const input = (
		<select className={className} {...useKeyValueWhenBlur(keyedValue)} name={field}>
			{options.map(({ key, label }) => (
				<option key={key} value={key}>
					{label}
				</option>
			))}
		</select>
	);
	return plain ? input : <Field>{input}</Field>;
}
