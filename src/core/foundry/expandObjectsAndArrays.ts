import { groupBy } from 'lodash/fp';

function maybeRecurse(key: string, entries: [string, unknown][], _d: number): unknown {
	return entries.length === 1 && entries[0][0] === key
		? entries[0][1]
		: expandObjectsAndArrays(
				Object.fromEntries(entries.map(([subKey, value]) => [subKey.substring(key.length + 1), value])),
				_d + 1
		  );
}

export function expandObjectsAndArrays(obj: Record<string, unknown>, _d = 0): unknown {
	if (_d > 100) {
		throw new Error('Maximum depth exceeded');
	}
	const groups = Object.entries(groupBy(([key]) => key.split('.')[0], Object.entries(obj)));
	if (!groups.map(([k]) => k).some((k) => `${Number(k)}` !== k)) {
		return groups.reduce((prev, [k, entries]) => {
			prev[Number(k)] = maybeRecurse(k, entries, _d);
			return prev;
		}, [] as unknown[]);
	}
	const topKeyGroups = Object.fromEntries(groups.map(([key, entries]) => [key, maybeRecurse(key, entries, _d)]));
	return topKeyGroups;
}
