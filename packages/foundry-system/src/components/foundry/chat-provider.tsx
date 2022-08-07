import { ChatMessageDispatcherContextProvider, ChatMessageDispatcherContext } from '@foundryvtt-dndmashup/mashup-react';
import { sendChatMessage } from '../../module/chat/sendChatMessage';

const chatMessageDispatcherContextValue: ChatMessageDispatcherContext = {
	sendChatMessage,
};

export function WrapChatMessageDispatcher({ children }: { children?: React.ReactNode }) {
	return (
		<ChatMessageDispatcherContextProvider value={chatMessageDispatcherContextValue}>
			{children}
		</ChatMessageDispatcherContextProvider>
	);
}
