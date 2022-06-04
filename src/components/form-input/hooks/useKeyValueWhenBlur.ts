import { useRef } from 'react';

type Result<T> = {
	defaultValue: T;
	key: React.Key;
	onBlur: () => void;
	onFocus: () => void;
};

export function useKeyValueWhenBlur<T extends React.Key>(value: T): Result<T>;
export function useKeyValueWhenBlur<T>(value: T, convert: (value: T) => React.Key): Result<T>;
export function useKeyValueWhenBlur<T>(value: T, convert?: (value: T) => React.Key): Result<T> {
	const converted = convert ? convert(value) : (value as never);
	const key = useRef(converted);
	const isFocused = useRef(false);

	if (!isFocused.current && key.current !== converted) {
		key.current = converted;
	}

	return {
		defaultValue: value,
		key: key.current,
		onBlur: () => void (isFocused.current = false),
		onFocus: () => void (isFocused.current = true),
	};
}
