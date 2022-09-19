import { useApplicationDispatcher } from '@foundryvtt-dndmashup/foundry-compat';
import { emptyConditionRuntime } from '@foundryvtt-dndmashup/mashup-react';
import { isGame } from '../../../core/foundry';
import { SpecificActor } from '../mashup-actor';
import { MashupActorSheet } from '../mashup-actor-sheet';
import { isActorType } from './isActorType';
import { MonsterSheet } from './MonsterSheet';
import { PcSheet } from './pcSheet';

export function ActorSheetJsx({ sheet }: { sheet: MashupActorSheet }) {
	const apps = useApplicationDispatcher();
	const actor = sheet.actor as SpecificActor;

	return isActorType(actor, 'pc') ? (
		<PcSheet actor={actor} onRollInitiative={onRollInitiative} />
	) : isActorType(actor, 'monster') ? (
		<MonsterSheet actor={actor} />
	) : null;

	function onRollInitiative() {
		if (!isGame(game)) return;

		const combatant = game.combat?.combatants.find((c) => c.actor === actor);
		if (!game.combat || !combatant?.id) {
			apps.launchApplication('diceRoll', {
				actor,
				baseDice: 'd20',
				rollType: 'initiative',
				title: 'Non-combat Initiative',
				allowToolSelection: false,
				sendToChat: true,
				flavor: `${actor.name} rolls for initiative!`,
				runtimeBonusParameters: { ...emptyConditionRuntime },
			});
			return;
		}

		if (typeof combatant.data.initiative === 'number') {
			ui.notifications?.warn('Cannot re-roll initiative from character sheet.');
			return;
		}
		game.combat.rollInitiative(combatant.id);
	}
}
