import classNames from 'classnames';

export const buttonStandardClasses: string = (
	<button
		className={classNames(
			'px-2 py-1 border border-black rounded',
			'bg-tan-accent bg-opacity-10 shadow active:shadow-none',
			'focus-within:ring-blue-bright-600 focus-within:ring-1',
			'hover:ring-blue-bright-600 hover:ring-1'
		)}
	/>
).props.className;
