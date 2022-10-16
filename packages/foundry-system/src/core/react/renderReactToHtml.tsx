import { PrerenderDetectionContextProvider } from '@foundryvtt-dndmashup/foundry-compat';
import { renderToString } from 'react-dom/server';

export async function renderReactToHtml(el: JSX.Element) {
	const result = renderToString(
		<PrerenderDetectionContextProvider value={true}>{el}</PrerenderDetectionContextProvider>
	);
	return result;
}
