import { isGame } from '../../../core/foundry';
import { SpecificActor } from '../mashup-actor';
import { MashupActorSheet } from '../mashup-actor-sheet';
import { PossibleActorData } from '../types';
import { MonsterSheet } from './MonsterSheet';
import { PcSheet } from './pcSheet';

function isActorType<T extends PossibleActorData['type']>(actor: SpecificActor, type: T): actor is SpecificActor<T> {
	return actor.data.type === type;
}

export function ActorSheetJsx({ sheet }: { sheet: MashupActorSheet }) {
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
			ui.notifications?.warn('Not in combat.');
			return;
		}

		if (typeof combatant.data.initiative === 'number') {
			ui.notifications?.warn('Cannot re-roll initiative from character sheet.');
			return;
		}
		game.combat.rollInitiative(combatant.id);
	}
}
