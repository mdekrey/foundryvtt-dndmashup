import { ImmutableStateMutator } from '../form-input/hooks/useDocumentAsState';

export function ImageEditor({
	title,
	className,
	value,
	onChangeValue,
}: {
	title: string | null;
	className?: string;
} & ImmutableStateMutator<string | null>) {
	return (
		<img
			src={value ?? ''}
			onClick={showFilePicker}
			title={title ?? ''}
			className={className ?? 'w-24 h-24 border-2 border-black p-px'}
		/>
	);

	function showFilePicker() {
		const fp = new FilePicker({
			type: 'image',
			current: value ?? '',
			callback: (path) => {
				onChangeValue(() => path);
			},
		});
		return fp.browse(value ?? '');
	}
}
