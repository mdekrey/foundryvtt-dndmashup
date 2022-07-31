import {
	ChatMessageDispatcherContextProvider,
	ChatMessageDispatcherContext,
	chatMessageRegistry,
	ActorDocument,
} from '@foundryvtt-dndmashup/mashup-react';
import { MashupChatMessageType } from '@foundryvtt-dndmashup/mashup-react';
import { ChatMessageDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/chatMessageData';
import { isGame } from '../../core/foundry';
import { renderReactToHtml } from '../../core/react';
import { FoundryWrapper } from './foundry-wrapper';

async function sendChatMessage<T extends MashupChatMessageType>(
	messageType: T,
	speaker: ActorDocument | null,
	properties: MashupChatMessage[T]
): Promise<unknown> {
	if (!isGame(game) || !game.user) return;
	const { flags, ...result } = (await chatMessageRegistry[messageType](
		speaker,
		properties
	)) as ChatMessageDataConstructorData & Record<string, unknown>;

	const html = await renderReactToHtml(<FoundryWrapper></FoundryWrapper>);

	return ChatMessage.create({
		user: game.user.id,
		type: CONST.CHAT_MESSAGE_TYPES.OTHER,
		content: html,
		flags: {
			'attach-component': 'power',
			...flags,
		},
		speaker: speaker && {
			actor: speaker.id,
			token: speaker.token?.id,
			alias: speaker.name,
		},
		...result,
	});
}

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
