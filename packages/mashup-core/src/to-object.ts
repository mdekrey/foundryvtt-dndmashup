export function toObject<T, TKey extends keyof any, TValue>(
	items: readonly T[],
	toKey: (item: T) => TKey,
	toValue: (item: T) => TValue
): Record<TKey, TValue> {
	return items.reduce((prev, item) => {
		prev[toKey(item)] = toValue(item);
		return prev;
	}, {} as Record<TKey, TValue>);
}
