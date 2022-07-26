import { ActorDocument } from '../../actor/documentType';

export function bloodied({ actor }: { actor: ActorDocument }) {
	if (actor.data.data.health.hp.value < actor.derivedData.health.hp.max) return true;
	return false;
}
