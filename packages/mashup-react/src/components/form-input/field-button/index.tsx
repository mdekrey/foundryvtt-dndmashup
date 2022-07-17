import classNames from 'classnames';
import { TextPlaceholder } from 'src/components/text-placeholder';
import { Field } from '../field';

export function FieldButton({
	addClassName,
	children,
	...buttonProps
}: Omit<JSX.IntrinsicElements['button'], 'type'> & { addClassName?: string }) {
	return (
		<Field
			className={classNames(
				addClassName,
				'ring-transparent hover:ring-blue-bright-600 cursor-pointer ring-text-shadow'
			)}>
			<button type="button" className="text-left" {...buttonProps}>
				{children ?? <TextPlaceholder />}
			</button>
		</Field>
	);
}
