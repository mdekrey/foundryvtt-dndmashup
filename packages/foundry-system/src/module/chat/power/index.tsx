import { fromMashupId, isGame, toMashupId } from '../../../core/foundry';
import { chatAttachments, ChatMessageProps } from '../attach';
import { PowerChat } from './PowerChat';
import { useApplicationDispatcher } from '@foundryvtt-dndmashup/foundry-compat';
import {
	ActorDocument,
	AttackRoll,
	EffectTypeAndRange,
	chatMessageRegistry,
	PowerDocument,
	PowerChatMessage,
} from '@foundryvtt-dndmashup/mashup-react';
import { PowerEffectTemplate } from '../../aura/power-effect-template';
import { MashupActor } from '../../actor/mashup-actor';

chatMessageRegistry.power = powerChatMessage;
chatAttachments['power'] = PowerChatRef;

async function powerChatMessage(actor: ActorDocument | null, { item }: PowerChatMessage) {
	if (!actor) return;

	return {
		flags: {
			actor: toMashupId(actor),
			item: toMashupId(item),
		},
	};
}

function PowerChatRef({ flags: { item: itemId, actor: actorId } }: ChatMessageProps) {
	if (!isGame(game)) {
		console.error('no game', game);
		throw new Error('Could not attach');
	}
	const actor = typeof actorId !== 'string' ? null : (fromMashupId(actorId) as MashupActor);
	const item = typeof itemId !== 'string' ? null : fromMashupId(itemId);

	if (!actor || !item) {
		console.error('no actor or item', { actor, item, actorId, itemId });
		throw new Error('Could not attach');
	}

	return <RenderPowerChat item={item as unknown as PowerDocument} actor={actor} />;
}

function RenderPowerChat({ item, actor }: { item: PowerDocument; actor: ActorDocument }) {
	const applications = useApplicationDispatcher();

	return (
		<PowerChat
			item={item}
			actor={actor}
			canCreateEffect={PowerEffectTemplate.canCreate}
			createEffect={createEffect}
			rollAttack={rollAttack}
		/>
	);

	function createEffect(typeAndRange: EffectTypeAndRange) {
		const template = PowerEffectTemplate.fromTypeAndRange(typeAndRange, actor.derivedData.size);
		if (actor && actor.sheet) actor.sheet.minimize();
		if (template)
			template.drawPreview(() => {
				if (actor && actor.sheet) actor.sheet.maximize();
			});
	}

	function rollAttack(attackRoll: AttackRoll, title: string) {
		applications.launchApplication('attackRoll', {
			baseDice: `1d20 + ${attackRoll.attack}`,
			title: `${item.name} ${title}`.trim(),
			actor,
			power: item,
			rollType: 'attack-roll',
			defense: attackRoll.defense,
			allowToolSelection: true,
		});
	}
}
