import classNames from 'classnames';

export const ChatButton = ({ className, ...props }: JSX.IntrinsicElements['button']) => (
	<button
		className={classNames(
			className,
			'px-2 py-1 border border-black',
			'focus-within:ring-blue-bright-600 focus-within:ring-1',
			'hover:ring-blue-bright-600 hover:ring-1'
		)}
		{...props}
		type="button"></button>
);
