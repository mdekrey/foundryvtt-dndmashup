export type SimpleApplication = {
	bringToTop(): void;
	close(options?: { force?: boolean | undefined }): Promise<void>;
	render(force?: boolean): unknown;
	minimize(): Promise<void>;
	maximize(): Promise<void>;
};
