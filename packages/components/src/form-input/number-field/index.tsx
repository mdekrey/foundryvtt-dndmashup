import { Field } from '../field';
import { ImmutableMutator } from '@foundryvtt-dndmashup/core';
import { useKeyValueWhenBlur } from '../hooks/useKeyValueWhenBlur';

export function NumberField({
	value,
	plain,
	onChange,
	onChangeValue,
	...props
}: {
	value: number;
	plain?: boolean;
	defaultValue?: never;
	type?: never;
	onChangeValue?: ImmutableMutator<number>;
} & JSX.IntrinsicElements['input']) {
	const onChangeProps = onChangeValue
		? {
				onChange(ev: React.ChangeEvent<HTMLInputElement>) {
					const newValue = Number(ev.currentTarget.value);
					if (newValue !== value) {
						onChangeValue(() => newValue);
					}
				},
		  }
		: {};

	const input = <input type="number" {...useKeyValueWhenBlur(value, { onChange, ...onChangeProps })} {...props} />;

	return plain ? input : <Field>{input}</Field>;
}
