import { SimpleDocument } from 'src/core/interfaces/simple-document';
import { MashupItemBase } from '../../mashup-item';
import { MashupPower } from './config';
import { PowerDocument } from './dataSourceData';

export function isPower(item: SimpleDocument): item is PowerDocument;
export function isPower(item: MashupItemBase): item is MashupPower;
export function isPower(item: SimpleDocument | MashupItemBase): item is MashupPower | PowerDocument {
	return item instanceof MashupPower;
}
