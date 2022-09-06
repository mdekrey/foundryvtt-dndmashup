import { ConditionRuleContext, conditionsRegistry } from '@foundryvtt-dndmashup/mashup-rules';
import { ActorDocument } from '../module/actor/documentType';
import { ItemDocument, PowerDocument } from '../module/item';

declare global {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface ConditionGrantingContext {
		actor: ActorDocument;
		item: ItemDocument;
	}
	interface ConditionRulesRuntimeParameters {
		power: PowerDocument;
	}
}

// export function proficientIn({ actor, item }: { actor: MashupActor; item: MashupItemBase }) {
export function proficientIn(
	{ actor, item }: ConditionRuleContext,
	parameter: null,
	{ power }: Partial<ConditionRulesRuntimeParameters>
) {
	// proficiency doesn't matter if it's not a "weapon" power!
	if (power && !power.data.data.keywords.includes('weapon')) return false;
	// TODO: better proficiency logic
	if (actor && item) return true;
	return false;
}

declare global {
	interface ConditionRules {
		proficientIn: null;
	}
}

conditionsRegistry.proficientIn = {
	ruleText: () => 'when you are proficient with the item',
	ruleEditor: () => null,
	rule: proficientIn,
};
