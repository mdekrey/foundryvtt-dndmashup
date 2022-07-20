import { SimpleDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { ClassDocument } from './dataSourceData';

export function isClass(item: SimpleDocument): item is ClassDocument {
	return item.type === 'class';
}
