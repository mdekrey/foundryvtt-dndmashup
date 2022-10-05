import { ActorDocument } from '../module/actor/documentType';
import { conditionsRegistry, ruleResultIndeterminate } from '@foundryvtt-dndmashup/mashup-rules';

export function bloodied({ actor }: { actor: ActorDocument | undefined }) {
	if (!actor) return ruleResultIndeterminate;
	if (actor.system.health.hp.value < actor.derivedData.health.hp.max) return true;
	return false;
}

declare global {
	interface ConditionRules {
		bloodied: never;
	}
}

conditionsRegistry.bloodied = { ruleText: () => 'when you are bloodied', ruleEditor: () => null, rule: bloodied };
