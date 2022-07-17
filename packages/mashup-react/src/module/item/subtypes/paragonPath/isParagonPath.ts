import { SimpleDocument } from 'src/core/interfaces/simple-document';
import { ParagonPathDocument } from './dataSourceData';

export function isParagonPath(item: SimpleDocument): item is ParagonPathDocument {
	return item.type === 'paragonPath';
}
