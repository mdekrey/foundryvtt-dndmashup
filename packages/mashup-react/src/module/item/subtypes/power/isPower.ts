import { SimpleDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { PowerDocument } from './dataSourceData';

export function isPower(item: SimpleDocument): item is PowerDocument {
	return item.type === 'power';
}
