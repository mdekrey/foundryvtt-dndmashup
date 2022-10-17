import { applicationRegistry } from '@foundryvtt-dndmashup/foundry-compat';
import { ApplyEffectDisplay, ComputableEffectDurationInfo } from '@foundryvtt-dndmashup/mashup-react';
import { getActorFromUuid } from '../../../core/foundry';
import { isGame } from '../../../core/foundry/isGame';
import type { MashupActor } from '../../actor';

applicationRegistry.applyEffect = async ({ effectParams, sources }, resolve, reject) => {
	await assertDuration(effectParams[1]);
	return {
		content: (
			<div className="flex flex-col h-full p-2 gap-2">
				<ApplyEffectDisplay
					targets={getTargets()}
					effectParams={effectParams}
					sources={sources}
					onClose={() => resolve(null)}
				/>
			</div>
		),
		title: 'Apply Effect',
		options: {
			resizable: false,
		},
	};
};

function getTargets() {
	if (!isGame(game)) return [];
	const tokens = game.canvas?.tokens?.controlled ?? [];
	return tokens.map((t) => t.actor).filter((t): t is MashupActor => !!t);
}

async function assertDuration(duration: ComputableEffectDurationInfo) {
	if ('actor' in duration) {
		const actorId = duration.actor;
		if (actorId) await assertActorInCombat(actorId);
	}

	async function assertActorInCombat(actorId: string) {
		const actor = await getActorFromUuid(actorId);
		if (!actor) {
			console.warn('Actor could not be located for duration', { actorId });
			ui.notifications?.warn(`Actor could not be located for duration.`);
			return;
		}
		if (isGame(game) && game.combat && !game.combat.combatants.find((c) => c.actor === actor)) {
			console.warn('Actor was not in combat', { actor, actorId });
			ui.notifications?.warn(`Actor ${actor.name} was not in combat.`);
			return;
		}
	}
}
