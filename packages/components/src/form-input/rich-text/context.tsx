import { createContext, useContext } from 'react';

export type RichTextEditorContext = {
	sanitizeHtml(
		input: string,
		options: Partial<{
			// See docs in foundry for TextEditor.enrichHTML
			secrets: boolean;
			documents: boolean;
			links: boolean;
			rolls: boolean;
			rollData: object | (() => object);
		}>
	): Promise<string>;
	activateEditor(options: {
		target: HTMLElement;
		initialValue: string;
		onChange?: (value: string) => void;
		onSave: (value: string) => void;
	}): void;
};

const richTextEditorContext = createContext<RichTextEditorContext | null>(null);

export const RichTextEditorContextProvider = richTextEditorContext.Provider;

export function useRichTextEditor(): RichTextEditorContext {
	const result = useContext(richTextEditorContext);
	if (!result) throw new Error('RichTextEditorContextProvider not found');

	return result;
}
