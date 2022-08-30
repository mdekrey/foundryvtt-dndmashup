import { twMerge } from 'tailwind-merge';

export const AppButton = ({ className, ...props }: JSX.IntrinsicElements['button']) => (
	<button
		className={twMerge(
			'px-2 py-1 border border-black',
			'focus-within:ring-blue-bright-600 focus-within:ring-1',
			'hover:ring-blue-bright-600 hover:ring-1',
			className
		)}
		{...props}
		type="button"></button>
);
