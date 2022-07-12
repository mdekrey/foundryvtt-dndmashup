import { SimpleDocument } from 'dndmashup-react/core/interfaces/simple-document';
import { MashupItemBase } from '../../mashup-item';
import { MashupItemFeature } from './config';
import { FeatureDocument } from './dataSourceData';

export function isFeature(item: SimpleDocument): item is FeatureDocument;
export function isFeature(item: MashupItemBase): item is MashupItemFeature;
export function isFeature(item: SimpleDocument | MashupItemBase): item is MashupItemFeature | FeatureDocument {
	return item instanceof MashupItemFeature;
}
