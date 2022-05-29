import { Children, ReactNode } from 'react';
import { isReactElement } from './isReactElement';

export type JsxMutator = (input: JSX.Element) => JSX.Element;

export function pipeJsx(original: JSX.Element, ...jsxMutate: JsxMutator[]) {
	return jsxMutate.reduce((prev, next) => next(prev), original);
}

export function pipeJsxChildren(children: ReactNode, ...jsxMutate: JsxMutator[]) {
	return Children.map(children, (child) => (isReactElement(child) ? pipeJsx(child, ...jsxMutate) : child));
}
