import React, { useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';

type Result<T extends React.Key, TElem extends HTMLElement> = {
	defaultValue: T;
	key: React.Key;
	onBlur: (ev: React.FocusEvent<TElem>) => void;
	onFocus: (ev: React.FocusEvent<TElem>) => void;
};

/*

Use cases:

1. We are typing anywhere in it and it is valid and updates, so we don't want the cursor to move
2. We blur, but it was invalid, so it needs to change back to last valid value
3. We are blurred and something else changes the value, so it needs to show the new value

*/

export function useKeyValueWhenBlur<T extends React.Key, TElem extends HTMLElement>(
	value: T,
	{ onChange }: { onChange?: React.ChangeEventHandler<TElem> } = {}
): Result<T, TElem> {
	const converted = value;
	const key = useRef(`${converted}`);
	const isFocused = useRef(false);
	const [rerenderKey, forceRerender] = useState('');

	if (!isFocused.current && key.current !== converted) {
		key.current = converted + rerenderKey;
	}

	return {
		defaultValue: value,
		key: key.current,
		onBlur: (ev: React.FocusEvent<TElem>) => {
			isFocused.current = false;
			key.current = uuid();
			forceRerender(key.current);
			onChange && onChange(ev);
		},
		onFocus: () => void (isFocused.current = true),
	};
}
