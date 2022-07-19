import {
	ChatMessageDispatcherContextProvider,
	ChatMessageDispatcherContext,
	chatMessageRegistry,
} from '@foundryvtt-dndmashup/mashup-react';
import { ChatMessageRegistryEntry, MashupChatMessageType } from '@foundryvtt-dndmashup/mashup-react';

const chatMessageDispatcherContextValue: ChatMessageDispatcherContext = {
	sendChatMessage<T extends MashupChatMessageType>(
		messageType: T,
		...params: Parameters<ChatMessageRegistryEntry<T>>
	): ReturnType<ChatMessageRegistryEntry<T>> {
		return chatMessageRegistry[messageType](...params);
	},
};

export function WrapChatMessageDispatcher({ children }: { children?: React.ReactNode }) {
	return (
		<ChatMessageDispatcherContextProvider value={chatMessageDispatcherContextValue}>
			{children}
		</ChatMessageDispatcherContextProvider>
	);
}
