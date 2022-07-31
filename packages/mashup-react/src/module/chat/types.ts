import { ActorDocument } from '../actor/documentType';

declare global {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface MashupChatMessage {}
}

export type MashupChatMessageType = keyof MashupChatMessage;

export type ChatMessageRegistryEntry<T extends keyof MashupChatMessage> = (
	speaker: ActorDocument | null,
	properties: MashupChatMessage[T]
) => Promise<Record<string, unknown> | undefined>;
