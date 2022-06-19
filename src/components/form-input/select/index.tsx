import { ReactNode, Key } from 'react';
import { Primitive } from 'src/core/path-typings';
import { Field } from '../field';
import { ImmutableMutator } from '../hooks/useDocumentAsState';

export type SelectItem<TValue extends Primitive> = {
	value: TValue;
	key: Key;
	label: ReactNode;
};

export function Select<TValue extends Primitive>({
	value,
	plain,
	options,
	onChangeValue,
	...selectProps
}: {
	value: TValue;
	plain?: boolean;
	options: SelectItem<TValue>[];
	onChangeValue?: ImmutableMutator<TValue>;
} & Omit<JSX.IntrinsicElements['select'], 'value'>) {
	const currentEntry = options.find((k) => k.value === value) ?? options[0];
	const onChangeProps = onChangeValue
		? {
				onChange(ev: React.ChangeEvent<HTMLSelectElement>) {
					const newEntry = options.find((k) => k.key === ev.currentTarget.value);
					const newValue = newEntry ? newEntry.value : options[0].value;
					if (newEntry !== currentEntry) onChangeValue(() => newValue);
				},
		  }
		: {};
	const input = (
		<select value={currentEntry.key} {...selectProps} {...onChangeProps}>
			{options.map(({ key, label }) => (
				<option key={key} value={key}>
					{label}
				</option>
			))}
		</select>
	);
	return plain ? input : <Field>{input}</Field>;
}
