import { renderReactToHtml } from 'src/core/react';
import { SpecificActor } from 'src/module/actor/mashup-actor';
import { PowerPreview } from 'src/module/item/subtypes/power/components/PowerPreview';
import { MashupPower } from 'src/module/item/subtypes/power/config';
import { fromMashupId, toMashupId } from 'src/core/foundry';
import { chatAttachments, ChatMessageProps } from '../attach';
import { PowerChat } from './PowerChat';

export async function powerChatMessage(actor: SpecificActor, item: MashupPower) {
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

	return <PowerChat item={item as MashupPower} actor={actor} />;
}
