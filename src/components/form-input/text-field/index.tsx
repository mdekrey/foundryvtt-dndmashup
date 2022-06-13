import { Field } from '../field';
import { ImmutableMutator } from '../hooks/useDocumentAsState';
import { useKeyValueWhenBlur } from '../hooks/useKeyValueWhenBlur';

export function TextField({
	value,
	plain,
	onChange,
	onChangeValue,
	...props
}: {
	value: string;
	plain?: boolean;
	defaultValue?: never;
	type?: never;
	onChangeValue?: ImmutableMutator<string>;
} & JSX.IntrinsicElements['input']) {
	const onChangeProps = onChangeValue
		? {
				onChange: (ev: React.ChangeEvent<HTMLInputElement>) => onChangeValue(() => ev.currentTarget.value),
		  }
		: {};

	const input = <input type="text" {...useKeyValueWhenBlur(value, { onChange })} {...onChangeProps} {...props} />;

	return plain ? input : <Field>{input}</Field>;
}
