import { Field } from '../field';
import { useKeyValueWhenBlur } from '../hooks/useKeyValueWhenBlur';

export function TextField({
	value,
	plain,
	onChange,
	...props
}: {
	value: string | number;
	plain?: boolean;
	defaultValue?: never;
	type?: never;
} & JSX.IntrinsicElements['input']) {
	const input = <input type="text" {...useKeyValueWhenBlur(value, { onChange })} {...props} />;

	return plain ? input : <Field>{input}</Field>;
}
