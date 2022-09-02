import { fromMashupId, isGame, toMashupId } from '../../../core/foundry';
import { chatAttachments, ChatMessageProps } from '../attach';
import {
	ActorDocument,
	chatMessageRegistry,
	ShareChatMessage,
	PowerPreview,
	isPower,
	isEquipment,
	EquipmentPreview,
} from '@foundryvtt-dndmashup/mashup-react';
import { neverEver } from '@foundryvtt-dndmashup/core';

chatMessageRegistry.share = shareChatMessage;
chatAttachments['share'] = ShareChatRef;

async function shareChatMessage(actor: ActorDocument | null, { item }: ShareChatMessage) {
	if (!actor) return;

	return {
		flags: {
			item: toMashupId(item),
		},
	};
}

function ShareChatRef({ flags: { item: itemId }, speaker: { actor: actorId } }: ChatMessageProps) {
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

	return <RenderShareChat item={item as unknown as ShareChatMessage['item']} actor={actor} />;
}

function RenderShareChat({ item, actor }: { item: ShareChatMessage['item']; actor: ActorDocument }) {
	return (
		<div className="w-full border-4 border-white">
			{isPower(item) ? (
				<PowerPreview item={item} />
			) : isEquipment(item) ? (
				<EquipmentPreview item={item} />
			) : (
				neverEver(item)
			)}
		</div>
	);
}
