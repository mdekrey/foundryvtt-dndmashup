import { useEffect, useRef, useState } from 'react';
import { Stateful } from '@foundryvtt-dndmashup/core';
import { useRichTextEditor } from './context';

export { RichTextEditorContextProvider } from './context';
export type { RichTextEditorContext } from './context';

export function RichText({
	rollData,
	value: html,
	onChangeValue,
	isEditor,
}: {
	isEditor: boolean;
	rollData?: object | (() => object);
} & Stateful<string>) {
	const { sanitizeHtml, activateEditor: innerActivateEditor } = useRichTextEditor();
	const [htmlContent, setHtmlContent] = useState('');
	useEffect(() => {
		sanitizeHtml(html ?? '', {
			rollData,
			/* TODO - parameters: secrets: owner, documents - but I'm not sure what they do */
		}).then((enrichedHtml) => setHtmlContent(enrichedHtml));
	});
	const editorContent = useRef<HTMLDivElement>(null);
	const initialContent = useRef(html);
	const latestContent = useRef(html);
	latestContent.current = html;

	useEffect(() => {
		return () => {
			if (latestContent.current !== initialContent.current) {
				onChangeValue(() => latestContent.current);
			}
		};
	}, []);

	return (
		<>
			<div className="editor relative h-full group">
				<div className="h-full" ref={editorContent} dangerouslySetInnerHTML={{ __html: htmlContent }} />
				{isEditor ? (
					<button
						type="button"
						className="editor-edit group-hover:block hidden absolute top-1 right-1 ring-transparent hover:ring-blue-bright-600 cursor-pointer ring-text-shadow"
						onClick={activateEditor}>
						<i className="fas fa-edit"></i>
					</button>
				) : null}
			</div>
		</>
	);

	function activateEditor() {
		if (editorContent.current == null) {
			throw new Error('No editor div');
		}
		innerActivateEditor({
			target: editorContent.current,
			initialValue: (initialContent.current = html),
			onChange: (newValue) => {
				latestContent.current = newValue;
			},
			onSave: (newContent) => onChangeValue(() => newContent),
		});
	}
}
