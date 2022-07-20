import { SimpleDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { RaceDocument } from './dataSourceData';

export function isRace(item: SimpleDocument): item is RaceDocument {
	return item.type === 'race';
}
