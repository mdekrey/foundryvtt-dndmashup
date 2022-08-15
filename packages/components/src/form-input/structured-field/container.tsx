import classNames from 'classnames';
import { Field } from '../field';

export function StructuredField({ children, className }: { children?: React.ReactNode; className?: string }) {
	return (
		<Field>
			<div className={classNames('w-full flex items-baseline', className)}>{children}</div>
		</Field>
	);
}
