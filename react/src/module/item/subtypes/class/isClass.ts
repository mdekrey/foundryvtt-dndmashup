import { SimpleDocument } from 'src/core/interfaces/simple-document';
import { ClassDocument } from './dataSourceData';

export function isClass(item: SimpleDocument): item is ClassDocument {
	return item.type === 'class';
}
