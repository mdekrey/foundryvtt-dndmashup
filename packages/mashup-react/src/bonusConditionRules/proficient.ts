import { ConditionRuleContext, conditionsRegistry } from '@foundryvtt-dndmashup/mashup-rules';
import { ActorDocument } from '../module/actor/documentType';
import { ItemDocument } from '../module/item';

declare global {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface ConditionGrantingContext {
		actor: ActorDocument;
		item: ItemDocument;
	}
}

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
	ruleEditor: () => null,
	rule: proficientIn,
};
