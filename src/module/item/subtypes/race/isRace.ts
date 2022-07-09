import { SimpleDocument } from 'src/core/interfaces/simple-document';
import { MashupItemRace } from './config';
import { MashupItemBase } from '../../mashup-item';
import { RaceDocument } from './dataSourceData';

export function isRace(item: SimpleDocument): item is RaceDocument;
export function isRace(item: MashupItemBase): item is MashupItemRace;
export function isRace(item: SimpleDocument | MashupItemBase): item is MashupItemRace | RaceDocument {
	return item instanceof MashupItemRace;
}
