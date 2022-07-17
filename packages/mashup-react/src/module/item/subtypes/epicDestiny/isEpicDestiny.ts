import { SimpleDocument } from 'src/core/interfaces/simple-document';
import { EpicDestinyDocument } from './dataSourceData';

export function isEpicDestiny(item: SimpleDocument): item is EpicDestinyDocument {
	return item.type === 'epicDestiny';
}
