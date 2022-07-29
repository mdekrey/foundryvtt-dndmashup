import { SimpleApplication } from '@foundryvtt-dndmashup/foundry-compat';

declare global {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface MashupApplication {}

	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface MashupApplicationResult {}
}

export type MashupApplicationType = keyof MashupApplication;

export type ApplicationRegistryEntry<T extends keyof MashupApplication> = (
	properties: MashupApplication[T]
) => T extends keyof MashupApplicationResult ? MashupApplicationResult[T] : SimpleApplication;
