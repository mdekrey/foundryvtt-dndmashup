import { SimpleDocument } from 'dndmashup-react/core/interfaces/simple-document';
import { MashupItemBase } from '../../mashup-item';
import { MashupParagonPath } from './config';
import { ParagonPathDocument } from './dataSourceData';

export function isParagonPath(item: SimpleDocument): item is ParagonPathDocument;
export function isParagonPath(item: MashupItemBase): item is MashupParagonPath;
export function isParagonPath(item: SimpleDocument | MashupItemBase): item is MashupParagonPath | ParagonPathDocument {
	return item instanceof MashupParagonPath;
}
