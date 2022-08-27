import classNames from 'classnames';

export function RulesText({
	label,
	children,
	className,
}: {
	label?: string;
	children?: React.ReactNode;
	className?: string;
}) {
	return label && children ? (
		<div className={className}>
			<span
				className={classNames('font-bold float-left pr-1', {
					'pl-8': label.startsWith('\t\t'),
					'pl-4': label.startsWith('\t') && !label.startsWith('\t\t'),
				})}>
				{label.trimStart()}:
			</span>
			{children}
		</div>
	) : label ? (
		<div className={classNames('font-bold', className)}>{label}</div>
	) : (
		<div className={className}>{children}</div>
	);
}
