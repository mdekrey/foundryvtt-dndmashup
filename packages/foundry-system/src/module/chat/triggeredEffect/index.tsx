import { ActorDocument, chatMessageRegistry, InstantaneousEffectSection } from '@foundryvtt-dndmashup/mashup-react';
import { getEffectText, getTriggerText, TriggeredEffect } from '@foundryvtt-dndmashup/mashup-rules';
import { isGame, toMashupId } from '../../../core/foundry';
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
				Activates a trigger: {getTriggerText(triggeredEffect.trigger)}: {getEffectText(triggeredEffect.effect)}
			</p>
			{triggeredEffect.effect.activeEffectTemplate ||
			triggeredEffect.effect.damage ||
			triggeredEffect.effect.healing ? (
				<InstantaneousEffectSection
					effect={triggeredEffect.effect}
					prefix="Trigger"
					mode="Trigger"
					actor={actor}
					allowToolSelection={true}
					allowCritical={true}
					extraBonuses={[]}
				/>
			) : null}
		</>
	);
}
