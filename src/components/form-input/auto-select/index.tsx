import { ReactNode, Key, useCallback } from 'react';
import { getFieldValue, PathName } from 'src/core/path-typings';
import { AnyDocument, SourceDataOf } from 'src/core/foundry';
import { Field } from '../field';
import { useControlledField } from '../hooks/useControlledField';
import { useSetField } from '../hooks/useSetField';

export type SelectItem<TValue> = {
	value: TValue;
	key: Key;
	label: ReactNode;
};

export function AutoSelect<TDocument extends AnyDocument, TValue>({
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
	const fieldValue = getFieldValue(document.data._source, field);
	const [value, setValue] = useControlledField(options.find((v) => v.value === fieldValue)?.key);
	const setField = useSetField(document, field);

	const handleChange = useCallback(
		(target: HTMLSelectElement) => {
			setValue(target.value);
			const found = options.find((v) => v.key === `${target.value}`);
			if (found) setField(found.value);
		},
		[document, field, setField]
	);

	const input = (
		<select
			value={value}
			className={className}
			onChange={document.isOwner ? (ev) => handleChange(ev.target) : undefined}>
			{options.map(({ key, label }) => (
				<option key={key} value={key}>
					{label}
				</option>
			))}
		</select>
	);
	return plain ? input : <Field>{input}</Field>;
}
