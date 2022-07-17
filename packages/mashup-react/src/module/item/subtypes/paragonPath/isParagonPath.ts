import { SimpleDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { ParagonPathDocument } from './dataSourceData';

export function isParagonPath(item: SimpleDocument): item is ParagonPathDocument {
	return item.type === 'paragonPath';
}
