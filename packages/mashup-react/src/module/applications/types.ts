declare global {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface MashupApplication {}

	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface MashupApplicationResult {}
}

export type MashupApplicationType = keyof MashupApplication;
export type MashupApplicationResultType<T extends keyof MashupApplication> = T extends keyof MashupApplicationResult
	? MashupApplicationResult[T]
	: null;

/** See import('packages\foundry-system\node_modules\@league-of-foundry-developers\foundry-vtt-types\src\foundry\client\apps\app.d.ts').ApplicationOptions */
export type ApplicationOptions = {
	/**
	 * The default pixel width for the rendered HTML
	 * @defaultValue `null`
	 */
	width: number | null;

	/**
	 * The default pixel height for the rendered HTML
	 * @defaultValue `null`
	 */
	height: number | 'auto' | null;

	/**
	 * Whether the rendered application can be drag-resized (popOut only)
	 * @defaultValue `false`
	 */
	resizable: boolean;
};

export type ApplicationRegistryEntry<T extends keyof MashupApplication> = (
	properties: MashupApplication[T],
	resolve: (result: MashupApplicationResultType<T>) => void,
	reject: () => void
) => Promise<{ content: JSX.Element; title: string; options?: Partial<ApplicationOptions> }>;
