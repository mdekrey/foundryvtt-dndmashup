import { cloneElement } from 'react';
import classNames from 'classnames';
import { JsxMutator } from './pipeJsx';

export function mergeStyles(template: JSX.Element): JsxMutator {
	return (previous) =>
		cloneElement(previous, {
			...previous.props,
			className: classNames(template.props.className, previous.props.className),
			style: { ...(template.props.style || {}), ...(previous.props.style || {}) },
		});
}
