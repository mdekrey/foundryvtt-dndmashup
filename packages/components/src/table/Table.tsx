import classNames from 'classnames';

export function Table({ className, children }: { className?: string; children?: React.ReactNode }) {
	return <table className={classNames('w-full border-collapse', className)}>{children}</table>;
}
