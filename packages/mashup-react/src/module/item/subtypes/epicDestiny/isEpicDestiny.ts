import { SimpleDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { EpicDestinyDocument } from './dataSourceData';

export function isEpicDestiny(item: SimpleDocument): item is EpicDestinyDocument {
	return item.type === 'epicDestiny';
}
