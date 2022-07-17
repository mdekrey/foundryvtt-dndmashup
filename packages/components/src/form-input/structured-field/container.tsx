import { Field } from '../field';

export function StructuredField({ children }: { children?: React.ReactNode }) {
	return (
		<Field>
			<div className="w-full flex items-baseline">{children}</div>
		</Field>
	);
}
