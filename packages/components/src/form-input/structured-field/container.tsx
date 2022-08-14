import { twMerge } from 'tailwind-merge';
import { Field } from '../field';

export function StructuredField({ children, className }: { children?: React.ReactNode; className?: string }) {
	return (
		<Field>
			<div className={twMerge('w-full flex items-baseline', className)}>{children}</div>
		</Field>
	);
}
