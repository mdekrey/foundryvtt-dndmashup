import { renderToString } from 'react-dom/server';

export async function renderReactToHtml(el: JSX.Element) {
	const result = renderToString(el);
	return result;
}
