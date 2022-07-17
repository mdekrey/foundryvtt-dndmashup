export type PowerChatMessage = {
	itemid: string;
};

declare global {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface MashupChatMessage {
		power: PowerChatMessage;
	}
}
