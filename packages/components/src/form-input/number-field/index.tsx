import { Field } from '../field';
import { ImmutableMutator } from '@foundryvtt-dndmashup/mashup-core';
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
					if (Number(ev.currentTarget.value) !== value) onChangeValue(() => Number(ev.currentTarget.value));
				},
		  }
		: {};

	const input = <input type="number" {...useKeyValueWhenBlur(value, { onChange, ...onChangeProps })} {...props} />;

	return plain ? input : <Field>{input}</Field>;
}
