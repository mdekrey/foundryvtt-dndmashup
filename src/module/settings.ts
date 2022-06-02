import { MashupActor } from './actor/mashup-actor';
import { MashupActorSheet } from './actor/mashup-actor-sheet';
import { MashupItemProxy } from './item/mashup-item-proxy';
import { MashupItemBase } from './item/mashup-item';
import { MashupItemSheet } from './item/mashup-item-sheet';
import { DocumentConstructor } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes';

declare global {
	interface DocumentClassConfig {
		Actor: typeof MashupActor;
		Item: typeof MashupItemBase & DocumentConstructor;
	}
}

export function registerSettings(): void {
	// Register any custom system settings here
	// TODO - figure out the formula for initiative
	// CONFIG.Combat.initiative = {
	// 	formula: '1d20 + @abilities.dex.mod',
	// 	decimals: 2,
	// };

	CONFIG.Actor.documentClass = MashupActor;
	CONFIG.Item.documentClass = MashupItemProxy;

	Actors.unregisterSheet('core', ActorSheet);
	Actors.registerSheet('actor', MashupActorSheet, { makeDefault: true });

	Items.unregisterSheet('core', ItemSheet);
	Items.registerSheet('item', MashupItemSheet, { makeDefault: true });
}
