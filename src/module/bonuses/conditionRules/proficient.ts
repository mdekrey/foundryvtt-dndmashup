import { MashupActor } from 'src/module/actor/mashup-actor';
import { MashupItemBase } from 'src/module/item/mashup-item-base';

// export function proficientIn({ actor, item }: { actor: MashupActor; item: MashupItemBase }) {
export function proficientIn({ actor, item }: { actor: MashupActor; item: MashupItemBase }) {
	if (actor && item) return true;
	return false;
}
