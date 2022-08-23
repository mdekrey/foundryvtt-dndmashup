export type DialogApplicationParameters = {
	title: string;
	content: string;
};

declare global {
	interface MashupApplication {
		dialog: DialogApplicationParameters;
	}
	interface MashupApplicationResult {
		dialog: boolean;
	}
}
