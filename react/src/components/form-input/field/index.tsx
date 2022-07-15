import { ReactNode } from 'react';
import classNames from 'classnames';
import { mergeStyles } from 'src/core/jsx/mergeStyles';
import { pipeJsxChildren } from 'src/core/jsx/pipeJsx';

export function Field({ className, children }: { className?: string; children?: ReactNode }) {
	const result =
		children &&
		pipeJsxChildren(
			children,
			mergeStyles(
				<i
					className={classNames(
						'w-full block',
						'border-solid border-b-2 border-black',
						'focus-within:ring-blue-bright-600 focus-within:ring-1',
						className
					)}
				/>
			)
		);
	return <>{result}</>;
}