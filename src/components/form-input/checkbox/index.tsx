import { ImmutableStateMutator } from '../hooks/useDocumentAsState';

export function Checkbox({
	value,
	onChangeValue,
	...checkboxProps
}: Omit<JSX.IntrinsicElements['input'], 'checked' | 'value'> & ImmutableStateMutator<boolean>) {
	const onChangeProps = onChangeValue
		? {
				onChange(ev: React.ChangeEvent<HTMLInputElement>) {
					if (ev.currentTarget.checked !== value) onChangeValue(() => ev.currentTarget.checked);
				},
		  }
		: {};

	return <input type="checkbox" className="mr-1" {...checkboxProps} checked={value} {...onChangeProps} />;
}
