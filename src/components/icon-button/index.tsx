import classNames from 'classnames';

export function IconButton({
	iconClassName,
	className,
	text,
	...buttonProps
}: JSX.IntrinsicElements['button'] & { children?: never; iconClassName: string; text?: string }) {
	return (
		<button
			className={classNames(
				className,
				'p-1 leading-none',
				'focus:ring-blue-bright-600 focus:ring-1',
				'whitespace-nowrap'
			)}
			{...buttonProps}
			type="button">
			<i className={classNames(iconClassName, 'm-0')} />
			{text ? ` ${text}` : null}
		</button>
	);
}
