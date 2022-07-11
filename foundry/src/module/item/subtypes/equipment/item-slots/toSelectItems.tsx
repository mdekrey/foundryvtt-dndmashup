import React from 'react';
import { SelectItem } from 'src/components/form-input';

export function toSelectItems<TKey extends React.Key & string>(record: Record<TKey, string>): SelectItem<TKey>[] {
	return Object.entries(record).map(([value, label]) => ({
		value: value as TKey,
		key: value,
		label: label as React.ReactNode,
		typeaheadLabel: label as string,
	}));
}

export function toNumericSelectItems<TKey extends React.Key & number>(
	record: Record<TKey, string>
): SelectItem<TKey>[] {
	return Object.entries(record).map(([value, label]) => ({
		value: Number(value) as TKey,
		key: value,
		label: label as React.ReactNode,
		typeaheadLabel: label as string,
	}));
}
