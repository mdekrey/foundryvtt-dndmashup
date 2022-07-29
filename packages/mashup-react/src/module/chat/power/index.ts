import { PowerDocument } from '../../item/subtypes/power/dataSourceData';

export type PowerChatMessage = {
	item: PowerDocument;
};

declare global {
	interface MashupChatMessage {
		power: PowerChatMessage;
	}
}
