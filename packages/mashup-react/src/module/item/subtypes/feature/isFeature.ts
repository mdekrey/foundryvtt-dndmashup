import { SimpleDocument } from 'src/core/interfaces/simple-document';
import { FeatureDocument } from './dataSourceData';

export function isFeature(item: SimpleDocument): item is FeatureDocument;
export function isFeature(item: SimpleDocument): item is FeatureDocument {
	return item.type === 'feature';
}
