import { mergeStyles } from 'dndmashup-react/core/jsx/mergeStyles';
import { pipeJsxChildren } from 'dndmashup-react/core/jsx/pipeJsx';

export function MainField({ children }: { children?: React.ReactNode }) {
	const result = children && pipeJsxChildren(children, mergeStyles(<i className="min-w-0 flex-shrink text-center" />));
	return <>{result}</>;
}
