import { Stateful } from '@foundryvtt-dndmashup/mashup-core';

export function Checkbox({
	value,
	onChangeValue,
	...checkboxProps
}: Omit<JSX.IntrinsicElements['input'], 'checked' | 'value'> & Partial<Stateful<boolean>>) {
	const onChangeProps = onChangeValue
		? {
				onChange(ev: React.ChangeEvent<HTMLInputElement>) {
					const newValue = ev.currentTarget.checked;
					if (newValue !== value) {
						onChangeValue(() => newValue);
					}
				},
		  }
		: {};

	return <input type="checkbox" {...checkboxProps} checked={value} {...onChangeProps} />;
}
