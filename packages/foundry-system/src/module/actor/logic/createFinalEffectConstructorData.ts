import { EffectDurationInfo } from '@foundryvtt-dndmashup/mashup-rules';
import { ActiveEffectDocumentConstructorParams, ActorDocument } from '@foundryvtt-dndmashup/mashup-react';
import { ActiveEffectDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/activeEffectData';
import { fromMashupId, isGame, toMashupId } from '../../../core/foundry';
import { v4 as uuid } from 'uuid';
import { MashupActor } from '../mashup-actor';

export function createFinalEffectConstructorData(
	[effect, duration, useStandardStats]: ActiveEffectDocumentConstructorParams,
	actor: ActorDocument,
	originalSources: string[] | undefined
): ActiveEffectDataConstructorData {
	let result: ActiveEffectDataConstructorData;

	if (effect.flags?.core?.statusId && useStandardStats) {
		result = deepClone(CONFIG.statusEffects.find((e) => e.id === effect.flags?.core?.statusId) ?? effect);
		result.label = effect.label;
		result.icon = effect.icon;
		result.flags ??= {};
		result.flags.core ??= {};
		result.flags.core.statusId = effect.flags?.core?.statusId;
		result.flags.mashup ??= {};
		result.flags.mashup.bonuses = [...(result.flags.mashup.bonuses ?? []), ...(effect.flags.mashup?.bonuses ?? [])];
		result.flags.mashup.triggers = [...(result.flags.mashup.triggers ?? []), ...(effect.flags.mashup?.triggers ?? [])];
		result.flags.mashup.auras = [...(result.flags.mashup.auras ?? []), ...(effect.flags.mashup?.auras ?? [])];
		result.flags.mashup.afterEffect = effect.flags.mashup?.afterEffect ?? null;
		result.flags.mashup.afterFailedSave = effect.flags.mashup?.afterFailedSave ?? null;
	} else {
		result = deepClone(effect);
		result.flags ??= {};
		result.flags.core ??= {};
		result.flags.mashup ??= {};
	}

	result.flags.mashup.originalSources = originalSources;

	let rounds: number | undefined;
	let resultDurationInfo: EffectDurationInfo | undefined;
	if (duration.durationType === 'endOfTurn' || duration.durationType === 'startOfTurn') {
		const relevantActor = typeof duration.actor === 'string' ? (fromMashupId(duration.actor) as MashupActor) : actor;
		const relevantActorId = typeof duration.actor === 'string' ? duration.actor : toMashupId(actor);
		const current = getCurrentInitiative(relevantActor);
		if (current !== undefined) {
			rounds = current.currentInitiative <= current.combatantInitiative ? current.round + 1 : current.round;
			resultDurationInfo = {
				durationType: duration.durationType,
				durationTurnInit: current.combatantInitiative,
				actorId: relevantActorId,
				actorName: relevantActor?.name ?? '',
			};
		} else {
			resultDurationInfo = undefined;
		}
	} else {
		resultDurationInfo = duration;
	}

	if (rounds !== undefined) {
		result.duration = { ...result.duration };
		result.duration.rounds = rounds;
	}

	if (resultDurationInfo) {
		result.flags.mashup.effectDuration = resultDurationInfo;
	}

	result.flags.core.statusId ??= uuid();

	return result;
}

function getCurrentInitiative(
	actor: ActorDocument | undefined
): { currentInitiative: number; combatantInitiative: number; round: number } | undefined {
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
		ui.notifications?.warn(`Initiative was not rolled.`);
		return undefined;
	}

	if (actor === undefined) return { round: combat.round, currentInitiative, combatantInitiative: currentInitiative };
	const combatant = combat.combatants.find((c) => c.actor === actor);
	if (!combatant) {
		console.warn(`Target could not be found to determine turn's end.`, actor);
		ui.notifications?.warn(`Target could not be found to determine turn's end.`);
		return { round: combat.round, currentInitiative, combatantInitiative: currentInitiative };
	}
	if (combatant.initiative === null || combatant.initiative === undefined) {
		console.warn(`Target had not rolled for initiative.`, actor);
		ui.notifications?.warn(`Target had not rolled for initiative.`);
		return { round: combat.round, currentInitiative, combatantInitiative: currentInitiative };
	}
	return { round: combat.round, currentInitiative, combatantInitiative: combatant.initiative };
}
