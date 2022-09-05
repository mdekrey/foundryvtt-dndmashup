import { Stateful } from '@foundryvtt-dndmashup/core';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';

export function Checkbox({
	value,
	onChangeValue,
	className,
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

	return (
		<input
			type="checkbox"
			className={twMerge(
				classNames('focus-within:ring-blue-bright-600 focus-within:ring-1', 'hover:ring-blue-bright-600 hover:ring-1'),
				className
			)}
			{...checkboxProps}
			checked={value}
			{...onChangeProps}
		/>
	);
}
