import { twMerge } from 'tailwind-merge';
import { buttonStandardClasses } from '../styles/button';

export const ChatButton = ({ className, ...props }: JSX.IntrinsicElements['button']) => (
	<button className={twMerge(buttonStandardClasses, className)} {...props} type="button"></button>
);
