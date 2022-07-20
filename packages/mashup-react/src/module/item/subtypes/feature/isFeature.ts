import { SimpleDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { FeatureDocument } from './dataSourceData';

export function isFeature(item: SimpleDocument): item is FeatureDocument;
export function isFeature(item: SimpleDocument): item is FeatureDocument {
	return item.type === 'feature';
}
