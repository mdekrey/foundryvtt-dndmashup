import { renderReactToHtml } from 'src/core/react';
import { PowerPreview } from 'dndmashup-react/src/module/item/subtypes/power/components/PowerPreview';
import { fromMashupId, toMashupId } from 'src/core/foundry';
import { chatAttachments, ChatMessageProps } from '../attach';
import { PowerChat } from './PowerChat';
import { ActorDocument } from 'dndmashup-react/src/module/actor/documentType';
import { PowerDocument } from 'dndmashup-react/src/module/item/subtypes/power/dataSourceData';

export async function powerChatMessage(actor: ActorDocument, item: PowerDocument) {
	if (!('user' in game) || !game.user) return;

	const html = await renderReactToHtml(<PowerPreview item={item} />);

	ChatMessage.create({
		user: game.user.id,
		type: CONST.CHAT_MESSAGE_TYPES.OTHER,
		content: html,
		flags: {
			'attach-component': 'power',
			item: toMashupId(item),
		},
		speaker: {
			actor: actor.id,
			token: actor.token?.id,
			alias: actor.name,
		},
	});
}

chatAttachments.power = PowerChatRef;

function PowerChatRef({ flags: { item: itemId }, speaker: { actor: actorId } }: ChatMessageProps) {
	if (!('actors' in game)) {
		console.error('no game', game);
		throw new Error('Could not attach');
	}
	const actor = actorId === null ? null : game.actors?.get(actorId);
	const item = typeof itemId !== 'string' ? null : fromMashupId(itemId);

	if (!actor || !item) {
		console.error('no actor or item', { actor, item, actorId, itemId });
		throw new Error('Could not attach');
	}

	return <PowerChat item={item as PowerDocument} actor={actor} />;
}
