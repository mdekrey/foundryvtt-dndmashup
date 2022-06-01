import classNames from 'classnames';

export function IconButton({
	iconClassName,
	className,
	...buttonProps
}: JSX.IntrinsicElements['button'] & { children?: never; iconClassName: string }) {
	return (
		<button
			className={classNames(className, 'text-lg p-1 leading-none', 'focus:ring-blue-bright-600 focus:ring-1', 'mr-1')}
			{...buttonProps}
			type="button">
			<i className={classNames(iconClassName, 'm-0')} />
		</button>
	);
}
