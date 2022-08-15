import { twMerge } from 'tailwind-merge';

export function BlockHeader({ className, ...props }: React.ComponentPropsWithoutRef<'p'>) {
	return <p className={twMerge('bg-theme text-white px-2 font-bold text-center py-1', className)} {...props} />;
}
