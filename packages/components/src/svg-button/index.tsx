import classNames from 'classnames';

export function SvgButton({
	className,
	icon: Icon,
	text,
	...buttonProps
}: Omit<JSX.IntrinsicElements['button'], 'children'> & {
	icon: typeof import('*.svg')['ReactComponent'];
	title: string;
	text?: string;
}) {
	return (
		<button
			className={classNames(className, 'p-1', 'focus:ring-blue-bright-600 focus:ring-1')}
			{...buttonProps}
			type="button">
			<Icon className="w-5 h-5" />
			{text}
		</button>
	);
}
