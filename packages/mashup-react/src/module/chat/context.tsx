import { createContext, useContext } from 'react';
import { ChatMessageRegistryEntry, MashupChatMessageType } from './types';

export type ChatMessageDispatcherContext = {
	sendChatMessage<T extends MashupChatMessageType>(
		messageType: T,
		...params: Parameters<ChatMessageRegistryEntry<T>>
	): ReturnType<ChatMessageRegistryEntry<T>>;
};

const chatMessageDispatcherContext = createContext<ChatMessageDispatcherContext | null>(null);

export const ChatMessageDispatcherContextProvider = chatMessageDispatcherContext.Provider;

export function useChatMessageDispatcher(): ChatMessageDispatcherContext {
	const result = useContext(chatMessageDispatcherContext);
	if (!result) throw new Error('ChatMessageDispatcherContextProvider not found');

	return result;
}
