import { ActorDocument } from '../../actor/documentType';

export function bloodied({ actor }: { actor: ActorDocument }) {
	if (actor.data.data.health.currentHp < actor.derivedData.health.maxHp) return true;
	return false;
}
