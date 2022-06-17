import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function RenderCallback({ children, onRender }: { children?: React.ReactNode; onRender: () => void }) {
	useEffect(() => {
		onRender();
	}, [onRender]);
	return <>{children}</>;
}

export async function renderReactToHtml(el: JSX.Element) {
	const target = $(`<div></div>`)[0];
	const root = createRoot(target);
	try {
		await new Promise((resolve) => root.render(<RenderCallback onRender={() => resolve(null)}>{el}</RenderCallback>));
		return target.innerHTML;
	} finally {
		root.unmount();
	}
}
