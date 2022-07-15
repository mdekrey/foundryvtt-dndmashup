import {
	ImageEditorContextProvider,
	ImageEditorContext,
} from 'dndmashup-react/src/components/form-input/image-editor/context';

const imageEditorContextValue: ImageEditorContext = ({ value, onChangeValue }) => {
	const fp = new FilePicker({
		type: 'image',
		current: value ?? '',
		callback: (path) => {
			onChangeValue(() => path);
		},
	});
	return fp.browse(value ?? '');
};

export function WrapImageEditor({ children }: { children?: React.ReactNode }) {
	return <ImageEditorContextProvider value={imageEditorContextValue}>{children}</ImageEditorContextProvider>;
}
