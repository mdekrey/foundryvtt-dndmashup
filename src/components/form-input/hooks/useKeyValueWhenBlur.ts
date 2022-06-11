import React, { useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';

type Result<T> = {
	defaultValue: T;
	key: React.Key;
	onBlur: () => void;
	onFocus: () => void;
};

/*

Use cases:

1. We are typing anywhere in it and it is valid and updates, so we don't want the cursor to move
2. We blur, but it was invalid, so it needs to change back to last valid value
3. We are blurred and something else changes the value, so it needs to show the new value

*/

export function useKeyValueWhenBlur<T extends React.Key>(value: T): Result<T>;
export function useKeyValueWhenBlur<T>(value: T, convert: (value: T) => React.Key): Result<T>;
export function useKeyValueWhenBlur<T>(value: T, convert?: (value: T) => React.Key): Result<T> {
	const converted = convert ? convert(value) : (value as never as React.Key);
	const key = useRef(converted);
	const isFocused = useRef(false);
	const [rerenderKey, forceRerender] = useState('');

	if (!isFocused.current && key.current !== converted) {
		key.current = converted + rerenderKey;
	}

	return {
		defaultValue: value,
		key: key.current,
		onBlur: () => {
			isFocused.current = false;
			key.current = uuid();
			forceRerender(key.current);
		},
		onFocus: () => void (isFocused.current = true),
	};
}
