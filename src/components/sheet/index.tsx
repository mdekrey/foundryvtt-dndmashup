import { createRoot, Root } from 'react-dom/client';

export { Root };

export type ReactSheet = {
	form: HTMLElement | null;
	root: Root | null;
};

export function renderReact<T extends DocumentSheet>(
	sheet: T & ReactSheet,
	SheetComponent: (props: { sheet: T }) => JSX.Element | null
) {
	let finalForm = sheet.form;
	let finalRoot = sheet.root;

	const cssClass = sheet.isEditable ? 'editable' : 'locked';

	if (!finalRoot || !finalForm) {
		const result = $(`<form class="${cssClass} foundry-reset dndmashup" autocomplete="off"></form>`);
		finalForm = result[0];
		finalRoot = createRoot(result[0]);
	}
	finalRoot.render(<SheetComponent sheet={sheet} />);

	return [finalForm, finalRoot, $(finalForm)] as const;
}
