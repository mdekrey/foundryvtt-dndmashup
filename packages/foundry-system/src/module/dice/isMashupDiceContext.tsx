import { MashupDiceContext } from './MashupDiceContext';

export function isMashupDiceContext(data?: unknown): data is MashupDiceContext {
	return 'actor' in (data as Record<string, unknown>);
}
