import { ActorDocument, chatMessageRegistry } from '@foundryvtt-dndmashup/mashup-react';
import { getEffectText, getTriggerText, TriggeredEffect } from '@foundryvtt-dndmashup/mashup-rules';
import { isGame, toMashupId } from 'packages/foundry-system/src/core/foundry';
import { chatAttachments } from '../attach';

chatMessageRegistry['triggered-effect'] = async (actor, { triggeredEffect }) => {
	if (!actor) return;

	return {
		flags: {
			actor: toMashupId(actor),
			triggeredEffect,
		},
	};
};
chatAttachments['triggered-effect'] = ({ flags: { triggeredEffect }, speaker: { actor: actorId } }) => {
	const myGame = game;
	if (!isGame(myGame)) {
		console.error('no game', myGame);
		throw new Error('Could not attach');
	}

	const actor = typeof actorId !== 'string' ? null : myGame.actors?.get(actorId);

	if (!actor) {
		console.error('no actor', { actor, actorId });
		throw new Error('Could not attach');
	}

	return <TriggeredEffectChat actor={actor} triggeredEffect={triggeredEffect as TriggeredEffect} />;
};

function TriggeredEffectChat({ actor, triggeredEffect }: { actor: ActorDocument; triggeredEffect: TriggeredEffect }) {
	return (
		<>
			<p>
				Has a trigger at {getTriggerText(triggeredEffect.trigger)} that: {getEffectText(triggeredEffect.effect)}
			</p>
			{/* <InstantaneousEffectSection
					effect={triggeredEffect.effect}
					mode="Trigger"
					actor={actor}
					allowToolSelection={true}
					allowCritical={true}
				/> */}
		</>
	);
}
