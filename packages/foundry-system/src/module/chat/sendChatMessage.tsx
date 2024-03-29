import { chatMessageRegistry, ActorDocument } from '@foundryvtt-dndmashup/mashup-react';
import { MashupChatMessageType } from '@foundryvtt-dndmashup/mashup-react';
import { ChatMessageDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/chatMessageData';
import { isGame } from '../../core/foundry';
import { renderReactToHtml } from '../../core/react/renderReactToHtml';
import { chatAttachments, ChatMessageProps } from '.';
import { FoundryWrapper } from '../../components/foundry/foundry-wrapper';

export async function sendPlainChatMesage(speaker: ActorDocument | null, message: string): Promise<unknown> {
	if (!isGame(game) || !game.user) return;

	const elem = document.createElement('div');
	elem.innerText = message;
	const html = elem.innerHTML;

	return ChatMessage.create({
		user: game.user.id,
		type: CONST.CHAT_MESSAGE_TYPES.OTHER,
		speaker: speaker
			? {
					actor: speaker.id,
					token: speaker.token?.id,
					alias: speaker.name,
			  }
			: {},
		content: html,
	});
}

export async function sendChatMessage<T extends MashupChatMessageType>(
	messageType: T,
	speaker: ActorDocument | null,
	properties: MashupChatMessage[T]
): Promise<unknown> {
	if (!isGame(game) || !game.user) return;
	const { flags, ...result } = (await chatMessageRegistry[messageType](
		speaker,
		properties
	)) as ChatMessageDataConstructorData & Record<string, unknown>;

	const messageInfo = {
		user: game.user.id,
		type: CONST.CHAT_MESSAGE_TYPES.OTHER,
		flags: {
			'attach-component': messageType,
			...flags,
		},
		speaker: speaker
			? {
					actor: speaker.id,
					token: speaker.token?.id,
					alias: speaker.name,
			  }
			: {},
		...result,
	} as ChatMessageProps;
	console.log('pre-html', messageInfo);

	try {
		const html = await renderReactToHtml(<FoundryWrapper>{chatAttachments[messageType](messageInfo)}</FoundryWrapper>);

		return ChatMessage.create({
			...messageInfo,
			content: html,
		});
	} catch (ex) {
		console.error(ex);
		return null;
	}
}
