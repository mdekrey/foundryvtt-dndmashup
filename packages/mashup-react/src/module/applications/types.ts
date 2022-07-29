declare global {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface MashupApplication {}

	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface MashupApplicationResult {}
}

export type MashupApplicationType = keyof MashupApplication;

export type ApplicationRegistryEntry<T extends keyof MashupApplication> = (
	properties: MashupApplication[T],
	resolve: (result: T extends keyof MashupApplicationResult ? MashupApplicationResult[T] : null) => void,
	reject: () => void
) => [content: JSX.Element, title: string];
