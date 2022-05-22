import { MashupActor } from '../../mashup-actor';

export function bloodied({ actor }: { actor: MashupActor }) {
	if (actor.data.data.health.currentHp < actor.data.data.health.maxHp) return true;
	return false;
}
