import { SimpleDocument } from 'src/core/interfaces/simple-document';
import { PowerDocument } from './dataSourceData';

export function isPower(item: SimpleDocument): item is PowerDocument {
	return item.type === 'power';
}
