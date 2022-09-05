import { Stateful } from '@foundryvtt-dndmashup/core';

declare global {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface Triggers {}
}

export type TriggerRegistryEntry<TType extends keyof Triggers> = {
	defaultParameter: Triggers[TType];
	text: (parameter?: Triggers[TType]) => string;
	editor: React.FC<Stateful<Triggers[TType] | undefined>>;
};

export const triggersRegistry: { [K in keyof Triggers]: TriggerRegistryEntry<K> } = {} as never;
