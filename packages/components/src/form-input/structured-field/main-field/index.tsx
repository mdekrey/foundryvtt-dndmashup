import { mergeStyles, pipeJsxChildren } from '@foundryvtt-dndmashup/mashup-core';

export function MainField({ children }: { children?: React.ReactNode }) {
	const result = children && pipeJsxChildren(children, mergeStyles(<i className="min-w-0 flex-shrink text-center" />));
	return <>{result}</>;
}
