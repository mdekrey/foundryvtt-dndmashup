import { SimpleDocument } from 'src/core/interfaces/simple-document';
import { RaceDocument } from './dataSourceData';

export function isRace(item: SimpleDocument): item is RaceDocument {
	return item.type === 'race';
}
