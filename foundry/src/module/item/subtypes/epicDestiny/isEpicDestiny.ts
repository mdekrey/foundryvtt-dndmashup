import { SimpleDocument } from 'dndmashup-react/core/interfaces/simple-document';
import { MashupItemBase } from '../../mashup-item';
import { MashupEpicDestiny } from './config';
import { EpicDestinyDocument } from './dataSourceData';

export function isEpicDestiny(item: SimpleDocument): item is EpicDestinyDocument;
export function isEpicDestiny(item: MashupItemBase): item is MashupEpicDestiny;
export function isEpicDestiny(item: SimpleDocument | MashupItemBase): item is MashupEpicDestiny | EpicDestinyDocument {
	return item instanceof MashupEpicDestiny;
}
