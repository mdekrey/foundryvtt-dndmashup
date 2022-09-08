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

export function proficientIn(
	{ actor, item }: ConditionRuleContext,
	parameter: null,
	{ power }: Partial<ConditionRulesRuntimeParameters>
) {
	// proficiency doesn't matter if it's not a "weapon" power!
	if (power && !power.data.data.keywords.includes('weapon')) return false;
	if (!actor || !item) return false;

	// TODO: "heavy blades" is written with a space, but "military heavy blades" can't be fully split up and will not match
	// const proficiencies = actor.allDynamicListResult.filter(item => item.target === 'proficiencies')
	// 	.map(item => item.entry)
	// 	.flatMap(item => [...item,])
	// 	.map(item => item.replace(kebab, '-'));
	return true;
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
