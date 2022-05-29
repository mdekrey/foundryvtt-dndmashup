import { ReactNode } from 'react';

export function Container({ className, children }: { className?: string; children?: ReactNode }) {
	return <label className={className}>{children}</label>;
}
