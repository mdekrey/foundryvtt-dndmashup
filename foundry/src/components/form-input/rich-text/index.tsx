import { useEffect, useRef } from 'react';
import { Stateful } from '../hooks/useDocumentAsState';

export function RichText({
	rollData,
	value: html,
	onChangeValue,
	isEditor,
}: {
	isEditor: boolean;
	rollData?: object | (() => object);
} & Stateful<string>) {
	const enriched = TextEditor.enrichHTML(html ?? '', {
		rollData,
		/* TODO - parameters: secrets: owner, documents - but I'm not sure what they do */
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
				<div className="h-full" ref={editorContent} dangerouslySetInnerHTML={{ __html: enriched }} />
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
		let editor: tinyMCE.Editor | null = null;
		const editorOptions = {
			target: editorContent.current,
			height: editorContent.current?.offsetHeight,
			save_onsavecallback: closeEditor,
		};

		initialContent.current = html;
		TextEditor.create(editorOptions, html).then((mce) => {
			editor = mce;
			mce.focus();
			mce.on('change', () => {
				latestContent.current = mce.getContent();
			});
		});

		async function closeEditor() {
			if (!editor) {
				throw new Error('No editor');
			}
			// Submit the form if the editor has changes
			const newContent = editor.getContent();
			const isDirty = newContent !== html;
			if (isDirty) await onChangeValue(() => newContent);

			// Remove the editor
			editor.destroy();
		}
	}
}
