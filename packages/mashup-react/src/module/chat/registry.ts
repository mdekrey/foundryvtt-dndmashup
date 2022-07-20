import { ChatMessageRegistryEntry } from './types';

export const chatMessageRegistry: { [K in keyof MashupChatMessage]: ChatMessageRegistryEntry<K> } = {} as never;
