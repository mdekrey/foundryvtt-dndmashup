import { ReactNode, Key } from 'react';
import { Field } from '../field';

export type SelectItem<TValue> = {
	value: TValue;
	key: Key;
	label: ReactNode;
};

export function Select<TValue>({
	plain,
	options,
	...selectProps
}: {
	plain?: boolean;
	options: SelectItem<TValue>[];
} & JSX.IntrinsicElements['select']) {
	const input = (
		<select {...selectProps}>
			{options.map(({ key, label }) => (
				<option key={key} value={key}>
					{label}
				</option>
			))}
		</select>
	);
	return plain ? input : <Field>{input}</Field>;
}
