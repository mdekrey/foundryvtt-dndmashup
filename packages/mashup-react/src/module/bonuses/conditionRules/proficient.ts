import { ConditionRuleContext } from '../constants';
import { conditionsRegistry } from '../registry';

// export function proficientIn({ actor, item }: { actor: MashupActor; item: MashupItemBase }) {
export function proficientIn({ actor, item }: ConditionRuleContext) {
	// TODO: better proficiency logic
	if (actor && item) return true;
	return false;
}

declare global {
	interface ConditionRules {
		proficientIn: never;
	}
}

conditionsRegistry.proficientIn = {
	ruleText: () => 'you are proficient with the item',
	rule: proficientIn,
};
