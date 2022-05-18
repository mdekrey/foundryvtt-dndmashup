import { MashupActor } from './actor/mashup-actor';

declare global {
	interface DocumentClassConfig {
		Actor: typeof MashupActor;
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

	Actors.unregisterSheet('core', ActorSheet);
}
