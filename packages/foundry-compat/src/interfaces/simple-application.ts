export type SimpleApplication = {
	bringToTop(): void;
	close(options?: { force?: boolean | undefined }): Promise<void>;
	minimize(): Promise<void>;
	maximize(): Promise<void>;
};
