import type { MashupActor } from '../mashup-actor';

export type ActionPointSpentParams = [actor: MashupActor];
export type PreActionPointSpentParams = [
	...params: ActionPointSpentParams,
	updates: DeepPartial<Record<string, unknown>>,
	descriptions: string[]
];

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Hooks {
		interface StaticCallbacks {
			preActionPointSpent: (...params: PreActionPointSpentParams) => void;
			actionPointSpent: (...params: ActionPointSpentParams) => void;
		}
	}
}
