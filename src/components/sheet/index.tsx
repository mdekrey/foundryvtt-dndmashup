import { createRoot, Root } from 'react-dom/client';
import { Provider } from './framework';

export { Root };

export function renderReact(
	form: HTMLElement | null,
	root: Root | null,
	cssClass: string,
	sheet: DocumentSheet,
	SheetComponent: () => JSX.Element | null
) {
	let finalForm = form;
	let finalRoot = root;

	if (!finalRoot || !finalForm) {
		const result = $(`<form class="${cssClass} foundry-reset dndmashup" autocomplete="off"></form>`);
		finalForm = result[0];
		finalRoot = createRoot(result[0]);
	}
	finalRoot.render(
		<Provider value={sheet}>
			<SheetComponent />
		</Provider>
	);

	return [finalForm, finalRoot, $(finalForm)] as const;
}
