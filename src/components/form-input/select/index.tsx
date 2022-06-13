import { ReactNode, Key } from 'react';
import { Field } from '../field';
import { ImmutableMutator } from '../hooks/useDocumentAsState';

export type SelectItem<TValue> = {
	value: TValue;
	key: Key;
	label: ReactNode;
};

export function Select<TValue>({
	plain,
	options,
	onChangeValue,
	...selectProps
}: {
	plain?: boolean;
	options: SelectItem<TValue>[];
	onChangeValue?: ImmutableMutator<TValue>;
} & JSX.IntrinsicElements['select']) {
	const onChangeProps = onChangeValue
		? {
				onChange: (ev: React.ChangeEvent<HTMLSelectElement>) =>
					onChangeValue(() => options.find((k) => k.key === ev.currentTarget.value)?.value ?? options[0].value),
		  }
		: {};
	const input = (
		<select {...selectProps} {...onChangeProps}>
			{options.map(({ key, label }) => (
				<option key={key} value={key}>
					{label}
				</option>
			))}
		</select>
	);
	return plain ? input : <Field>{input}</Field>;
}
