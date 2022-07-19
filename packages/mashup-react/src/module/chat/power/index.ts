import { PowerDocument } from '../../item/subtypes/power/dataSourceData';

export type PowerChatMessage = {
	item: PowerDocument;
};

declare global {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface MashupChatMessage {
		power: PowerChatMessage;
	}
}
