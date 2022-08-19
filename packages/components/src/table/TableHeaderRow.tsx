import { twMerge } from 'tailwind-merge';

export function TableHeaderRow({ className, children }: { className?: string; children?: React.ReactNode }) {
	return (
		<thead className={twMerge('bg-theme text-white h-6', className)}>
			<tr>{children}</tr>
		</thead>
	);
}
