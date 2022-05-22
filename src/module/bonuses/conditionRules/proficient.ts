import { MashupItem } from 'src/module/item/mashup-item';
import { MashupActor } from 'src/module/actor/mashup-actor';

export function proficientIn({ actor, item }: { actor: MashupActor; item: MashupItem }) {
	if (actor && item) return true;
	return false;
}
