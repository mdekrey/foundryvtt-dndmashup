import { ConditionRuleContext } from '../constants';

// export function proficientIn({ actor, item }: { actor: MashupActor; item: MashupItemBase }) {
export function proficientIn({ actor, item }: ConditionRuleContext) {
	// TODO: better proficiency logic
	if (actor && item) return true;
	return false;
}
