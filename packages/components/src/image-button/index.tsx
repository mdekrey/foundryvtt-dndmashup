import classNames from 'classnames';

export function ImageButton({
	className,
	src,
	...buttonProps
}: Omit<JSX.IntrinsicElements['button'], 'children'> & { src: string }) {
	return (
		<button
			className={classNames(className, 'p-1', 'focus:ring-blue-bright-600 focus:ring-1')}
			{...buttonProps}
			type="button">
			<img src={src} className="w-5 h-5" />
		</button>
	);
}
