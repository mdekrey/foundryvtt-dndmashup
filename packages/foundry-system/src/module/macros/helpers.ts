import { commonActions } from '@foundryvtt-dndmashup/mashup-react';
import { applicationDispatcher } from '../../components/foundry/apps-provider';
import { isGame } from '../../core/foundry';
import { MashupActor } from '../actor';
import { sendChatMessage } from '../chat/sendChatMessage';

export class MashupHotbarUtilities {
	static async usePower(powerName: string) {
		if (!isGame(game)) return;

		const actors = MashupHotbarUtilities.findControlledCharacters(
			(a) => !!a.allPowers(true).find((p) => p.name === powerName)
		);
		if (actors.length === 0) {
			ui.notifications?.warn(`No controlled actor with power named '${powerName}'.`);
			return;
		}

		for (const actor of actors) {
			const power = actor?.allPowers(true).find((p) => p.name === powerName);
			if (!power) continue;

			if (await actor.applyUsage(power)) {
				sendChatMessage('power', actor, { item: power });
			} else {
				ui.notifications?.warn(`Out of uses for '${powerName}' for '${actor.name}'.`);
			}
		}
	}

	static async useCommonAction(actionName: string) {
		const actors = MashupHotbarUtilities.findControlledCharacters();
		if (actors.length === 0) {
			ui.notifications?.warn(`No controlled actors to use '${actionName}'.`);
			return;
		}

		const commonAction = commonActions.find((a) => a.name === actionName);
		for (const actor of actors) {
			commonAction?.use(actor, { chatDispatch: { sendChatMessage }, appDispatch: applicationDispatcher });
		}
	}

	private static findControlledCharacters(predicate?: (actor: MashupActor) => boolean): MashupActor[] {
		if (!isGame(game)) return [];
		const actors = [...(canvas?.tokens?.controlled ?? []).map((t) => t.actor), game.user?.character].filter(
			(c): c is MashupActor => !!c
		);
		return predicate ? actors.filter(predicate) : actors;
	}
}

(window as any).MashupHotbar = MashupHotbarUtilities;
