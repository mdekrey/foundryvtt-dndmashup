import { RichTextEditorContextProvider, RichTextEditorContext } from '@foundryvtt-dndmashup/components';

const richTextEditorContextValue: RichTextEditorContext = {
	sanitizeHtml(input, options) {
		return TextEditor.enrichHTML(input, options);
	},
	activateEditor({ target, initialValue, onChange, onSave }) {
		let editor: tinyMCE.Editor | null = null;
		const editorOptions = {
			target: target,
			height: target.offsetHeight,
			save_onsavecallback: closeEditor,
		};

		TextEditor.create(editorOptions, initialValue).then((mce) => {
			editor = mce;
			mce.focus();
			mce.on('change', () => {
				onChange?.(mce.getContent());
			});
		});

		async function closeEditor() {
			if (!editor) {
				throw new Error('No editor');
			}
			// Submit the form if the editor has changes
			const newContent = editor.getContent();
			const isDirty = newContent !== initialValue;
			if (isDirty) onSave(newContent);

			// Remove the editor
			editor.destroy();
		}
	},
};

export function WrapRichTextEditor({ children }: { children?: React.ReactNode }) {
	return <RichTextEditorContextProvider value={richTextEditorContextValue}>{children}</RichTextEditorContextProvider>;
}
