import { ReactNode } from 'react';

export function Label({ children, className }: { children?: ReactNode; className?: string }) {
	return <div className={className ?? 'text-sm whitespace-nowrap'}>{children}</div>;
}
