import { useCallback } from 'react';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { useImageEditor } from './context';

const defaultEmpty = Lens.identity<string | null>().default('');

export { ImageEditorContextProvider } from './context';
export type { ImageEditorContext } from './context';

export function ImageEditor({
	title,
	className,
	value,
	defaultImage,
	onChangeValue,
}: {
	title: string | null;
	className?: string;
	defaultImage?: string;
} & Stateful<string | null>) {
	const showFilePickerWithState = useImageEditor();
	const showFilePicker = useCallback(() => {
		return showFilePickerWithState(defaultEmpty.apply({ value, onChangeValue }));
	}, [showFilePickerWithState, value, onChangeValue]);

	return (
		<img
			src={value ?? defaultImage ?? ''}
			onClick={showFilePicker}
			title={title ?? ''}
			className={className ?? 'w-24 h-24 border-2 border-black p-px'}
		/>
	);
}
