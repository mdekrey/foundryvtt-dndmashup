import { MashupActor } from 'src/module/actor/mashup-actor';

export function bloodied({ actor }: { actor: MashupActor }) {
	if (actor.data.data.health.currentHp < actor.derivedData.health.maxHp) return true;
	return false;
}
