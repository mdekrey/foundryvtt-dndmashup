import { ReactNode } from 'react';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';
import { mergeStyles, pipeJsxChildren } from '@foundryvtt-dndmashup/core';

export const fieldClassName: string = (
	<i
		className={classNames(
			'w-full block',
			'border-solid border-b-2 border-black',
			'focus-within:ring-blue-bright-600 focus-within:ring-1'
		)}
	/>
).props.className;

export function Field({ className, children }: { className?: string; children?: ReactNode }) {
	const result =
		children && pipeJsxChildren(children, mergeStyles(<i className={twMerge(fieldClassName, className)} />));
	return <>{result}</>;
}
