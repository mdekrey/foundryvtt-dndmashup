import { MashupActor } from 'src/module/actor/mashup-actor';
import { MashupItem } from 'src/module/item/mashup-item';

// export function proficientIn({ actor, item }: { actor: MashupActor; item: MashupItemBase }) {
export function proficientIn({ actor, item }: { actor: MashupActor; item: MashupItem }) {
	if (actor && item) return true;
	return false;
}
