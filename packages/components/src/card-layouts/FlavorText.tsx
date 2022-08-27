import classNames from 'classnames';

export function FlavorText({ children, className, ...props }: JSX.IntrinsicElements['p']) {
	return (
		<p className={classNames(className, 'italic font-flavor')} {...props}>
			{children}
		</p>
	);
}
