import { ActorDocument, ComputableEffectDurationInfo, EffectDurationInfo } from '@foundryvtt-dndmashup/mashup-react';
import { ActiveEffectDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/activeEffectData';
import { isGame } from '../../../core/foundry';

export function createFinalEffectConstructorData(
	effect: ActiveEffectDataConstructorData,
	duration: ComputableEffectDurationInfo,
	actor: ActorDocument
): ActiveEffectDataConstructorData {
	let rounds: number | undefined;
	let resultDurationInfo: EffectDurationInfo | undefined;
	if (duration.durationType === 'endOfTurn' || duration.durationType === 'startOfTurn') {
		const current = getCurrentInitiative(duration.actor);
		if (current !== undefined) {
			rounds = current.round + duration.rounds;
			resultDurationInfo = {
				durationType: duration.durationType,
				durationTurnInit: current.initiative,
			};
		} else {
			resultDurationInfo = undefined;
		}
	} else {
		resultDurationInfo = duration;
	}

	if (rounds !== undefined) {
		effect.duration = { ...effect.duration };
		effect.duration.rounds = rounds;
	}

	if (resultDurationInfo) {
		effect.flags ??= {};
		effect.flags.mashup ??= {};
		effect.flags.mashup.effectDuration = resultDurationInfo;
	}

	return effect;
}

function getCurrentInitiative(actor: ActorDocument | undefined): { initiative: number; round: number } | undefined {
	const combat = isGame(game) ? game.combat : null;
	if (combat === null) {
		ui.notifications?.warn(`Combat was not created.`);
		return undefined;
	}
	if (combat.round === null) {
		ui.notifications?.warn(`Combat was not started.`);
		return undefined;
	}
	if (combat.turn === null) {
		ui.notifications?.warn(`Combat was not started.`);
		return undefined;
	}
	const currentInitiative = combat.turns[combat.turn].initiative;
	if (currentInitiative === null) {
		ui.notifications?.warn(`Combat was not started.`);
		return undefined;
	}

	if (actor === undefined) return { round: combat.round, initiative: currentInitiative };
	const combatant = combat.combatants.find((c) => c.actor === actor);
	if (!combatant) {
		ui.notifications?.warn(`Target could not be found to determine turn's end.`);
		return { round: combat.round, initiative: currentInitiative };
	}
	if (combatant.initiative === null || combatant.initiative === undefined) {
		ui.notifications?.warn(`Target had not rolled for initiative.`);
		return { round: combat.round, initiative: currentInitiative };
	}
	return { round: combat.round, initiative: combatant.initiative };
}
