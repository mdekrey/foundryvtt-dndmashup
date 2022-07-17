import { useCallback } from 'react';
import { Lens, Stateful } from 'src/core/lens';
import { useImageEditor } from './context';

const defaultEmpty = Lens.identity<string | null>().default('');

export function ImageEditor({
	title,
	className,
	value,
	onChangeValue,
}: {
	title: string | null;
	className?: string;
} & Stateful<string | null>) {
	const showFilePickerWithState = useImageEditor();
	const showFilePicker = useCallback(() => {
		return showFilePickerWithState(defaultEmpty.apply({ value, onChangeValue }));
	}, [showFilePickerWithState, value, onChangeValue]);

	return (
		<img
			src={value ?? ''}
			onClick={showFilePicker}
			title={title ?? ''}
			className={className ?? 'w-24 h-24 border-2 border-black p-px'}
		/>
	);
}
