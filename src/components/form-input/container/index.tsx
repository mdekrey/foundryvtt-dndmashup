import classNames from 'classnames';

export function Container({ className, children }: { className?: string; children?: React.ReactNode }) {
	return <label className={classNames('flex flex-col', className)}>{children}</label>;
}
