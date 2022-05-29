import { ReactNode, ReactElement } from 'react';

export function isReactElement(child: ReactNode): child is ReactElement {
	return Boolean(typeof child === 'object' && child && !('length' in child));
}
