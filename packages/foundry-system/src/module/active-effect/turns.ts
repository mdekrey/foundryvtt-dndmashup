import { ActiveEffectDocument } from '@foundryvtt-dndmashup/mashup-react';
import { isGame } from '../../core/foundry';

export async function onNextTurn(wrapped: () => Promise<unknown>) {
	if (!isGame(game)) return;
	if (game.combat === null) return;
	if (game.combat.turn === null) return;
	if (!game.combat.combatant) return;
	const endOfRound = game.combat.turn + 1 >= game.combat.turns.length;

	const nextTurn = (game.combat.turn + 1) % game.combat.turns.length;
	const nextRound = game.combat.round + (endOfRound ? 1 : 0);
	const nextInit = game.combat.turns[nextTurn].initiative;

	// Helper.rechargeItems(game.combat.turns[nextTurn].actor, ["round"]);

	await endEffects(game.combat, 'endOfTurn');
	const result = await wrapped();
	await endEffects(game.combat, 'startOfTurn');

	return result;

	async function endEffects(combat: StoredDocument<Combat>, type: 'endOfTurn' | 'startOfTurn') {
		for (const t of combat.turns) {
			let toDelete: string[] = [];
			if (!t.token?.actor || !t.actor) continue;
			for (const e of t.token.actor.effects) {
				if (
					e.id &&
					e.data.flags.mashup?.effectDuration?.durationType === type &&
					shouldRemove(e, { nextInit, nextRound })
				) {
					toDelete.push(e.id);
				}
			}
			toDelete = toDelete.filter((s): s is string => !!s);
			if (toDelete.length) {
				await t.actor.removeActiveEffects(toDelete);
			}
		}
	}
}

function shouldRemove(
	e: ActiveEffectDocument,
	{ nextInit, nextRound }: { nextInit: number | null; nextRound: number }
): boolean {
	const effectData = e.data.flags.mashup?.effectDuration;

	if (effectData?.durationType === 'endOfTurn' || effectData?.durationType === 'startOfTurn') {
		if (e.data.duration.rounds === undefined) return false;
		const effectTime = combatTime(e.data.duration.rounds, effectData.durationTurnInit);
		const targetTime = nextInit && combatTime(nextRound, nextInit);
		if (!targetTime) return false;
		if (effectData.durationType === 'endOfTurn') {
			if (!nextInit) return false;
			return effectTime < targetTime;
		} else if (effectData.durationType === 'startOfTurn') {
			return effectTime <= targetTime;
		}
	}

	return false;
}

const maxInitiative = 128;
function combatTime(round: number, initiative: number) {
	// Initiative goes down,
	return round * maxInitiative - initiative;
}
