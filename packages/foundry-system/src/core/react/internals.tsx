import { createRoot, Root } from 'react-dom/client';
import { FoundryWrapper } from '../../components/foundry';

const elementRoot = Symbol('ElementRoot');
const reactRoot = Symbol('ReactRoot');

export type ReactSheet = {
	[elementRoot]?: HTMLElement | null;
	[reactRoot]?: Root | null;
};

export function renderReact<T extends Application>(sheet: T & ReactSheet, sheetComponent: JSX.Element | null) {
	let finalForm = sheet[elementRoot];
	let finalRoot = sheet[reactRoot];

	if (!finalRoot || !finalForm) {
		const result = $(sheet instanceof FormApplication ? `<form autocomplete="off"></form>` : `<div></div>`);
		result.addClass('foundry-reset dndmashup');
		finalForm = result[0];
		finalRoot = createRoot(result[0]);
	}
	finalRoot.render(<FoundryWrapper>{sheetComponent}</FoundryWrapper>);

	if (sheet instanceof FormApplication) sheet.form = finalForm;
	sheet[elementRoot] = finalForm;
	sheet[reactRoot] = finalRoot;
	return {
		element: finalForm,
		rerender: (newContent: JSX.Element) => finalRoot?.render(<FoundryWrapper>{newContent}</FoundryWrapper>),
	};
}

export function unmountReact<T extends Application>(sheet: T & ReactSheet) {
	if (sheet instanceof FormApplication) sheet.form = null;
	sheet[elementRoot] = null;
	sheet[reactRoot]?.unmount();
	sheet[reactRoot] = null;
}
