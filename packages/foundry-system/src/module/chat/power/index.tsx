import { renderReactToHtml } from '../../../core/react';
import { fromMashupId, isGame } from '../../../core/foundry';
import { chatAttachments, ChatMessageProps } from '../attach';
import { PowerChat } from './PowerChat';
import { ActorDocument } from '@foundryvtt-dndmashup/mashup-react';
import { chatMessageRegistry, PowerDocument, PowerChatMessage } from '@foundryvtt-dndmashup/mashup-react';
import { toMashupId } from '@foundryvtt-dndmashup/foundry-compat';
import { SpecificActor } from '../../actor/mashup-actor';

chatMessageRegistry.power = powerChatMessage;
chatAttachments['power'] = PowerChatRef;

async function powerChatMessage(actor: ActorDocument | null, { item }: PowerChatMessage) {
	if (!isGame(game) || !game.user) return;
	if (!actor) return;

	const html = await renderReactToHtml(<PowerChat item={item} actor={actor as SpecificActor} />);

	ChatMessage.create({
		user: game.user.id,
		type: CONST.CHAT_MESSAGE_TYPES.OTHER,
		content: html,
		flags: {
			'attach-component': 'power',
			item: toMashupId(item),
		},
		speaker: actor && {
			actor: actor.id,
			token: actor.token?.id,
			alias: actor.name,
		},
	});
}

function PowerChatRef({ flags: { item: itemId }, speaker: { actor: actorId } }: ChatMessageProps) {
	if (!isGame(game)) {
		console.error('no game', game);
		throw new Error('Could not attach');
	}
	const actor = actorId === null ? null : game.actors?.get(actorId);
	const item = typeof itemId !== 'string' ? null : fromMashupId(itemId);

	if (!actor || !item) {
		console.error('no actor or item', { actor, item, actorId, itemId });
		throw new Error('Could not attach');
	}

	return <PowerChat item={item as unknown as PowerDocument} actor={actor} />;
}
