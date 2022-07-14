import { Stateful } from 'src/core/lens';

export function Checkbox({
	value,
	onChangeValue,
	...checkboxProps
}: Omit<JSX.IntrinsicElements['input'], 'checked' | 'value'> & Stateful<boolean>) {
	const onChangeProps = onChangeValue
		? {
				onChange(ev: React.ChangeEvent<HTMLInputElement>) {
					if (ev.currentTarget.checked !== value) onChangeValue(() => ev.currentTarget.checked);
				},
		  }
		: {};

	return <input type="checkbox" {...checkboxProps} checked={value} {...onChangeProps} />;
}
