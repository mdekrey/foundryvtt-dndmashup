import { ActorDocument } from '../../actor/documentType';
import { conditionsRegistry } from '../registry';

export function bloodied({ actor }: { actor: ActorDocument }) {
	if (actor.data.data.health.hp.value < actor.derivedData.health.hp.max) return true;
	return false;
}

declare global {
	interface ConditionRules {
		bloodied: never;
	}
}

conditionsRegistry.bloodied = { ruleText: () => 'you are bloodied', rule: bloodied };
