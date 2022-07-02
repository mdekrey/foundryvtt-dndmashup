import React from 'react';
import { SelectItem } from 'src/components/form-input';

export function toSelectItems<TKey extends React.Key>(record: Record<TKey, string>): SelectItem<TKey>[] {
	return Object.entries(record).map(([value, label]) => ({
		value: value as TKey,
		key: value,
		label: label as React.ReactNode,
		typeaheadLabel: label as string,
	}));
}
