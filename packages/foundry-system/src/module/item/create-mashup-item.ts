import type { MashupItemBase } from './mashup-item';
import { itemMappings } from './subtypes';
import { PossibleItemType } from './types';

export function createMashupItem(
	...[data, options]: Parameters<typeof MashupItemBase['create']>
): ReturnType<typeof MashupItemBase['create']> {
	if (!data) throw new Error('No data for item');

	const type = (data as Record<string, unknown>)['type'] as PossibleItemType;

	if (!itemMappings.hasOwnProperty(type)) throw new Error(`Unsupported Entity type for create(): ${type}`);

	return itemMappings[type].create(data as never, options);
}
