import { BaseDocument } from '@foundryvtt-dndmashup/foundry-compat';
import {
	ConditionRuleContext,
	ConditionRulesRuntimeParameters,
	conditionsRegistry,
	ruleResultIndeterminate,
} from '@foundryvtt-dndmashup/mashup-rules';
import { TokenDocument } from '../module';

declare global {
	interface ConditionGrantingContext {
		activeEffectSources: BaseDocument[];
	}
	interface ConditionRulesAllRuntimeParameters {
		targets: TokenDocument[];
	}
}

export function targetsDoNotIncludeSource(
	{ activeEffectSources }: ConditionRuleContext,
	parameter: null,
	{ targets }: ConditionRulesRuntimeParameters
) {
	if (!activeEffectSources || !targets) return ruleResultIndeterminate;
	const targetsIncludesMarked = targets
		.map((token) => token.actor)
		.some((targetActor) => activeEffectSources.some((source) => source === targetActor));
	return !targetsIncludesMarked;
}

declare global {
	interface ConditionRules {
		targetsDoNotIncludeSource: null;
	}
}

conditionsRegistry.targetsDoNotIncludeSource = {
	ruleText: () => 'when the targets do not include the source', // TODO: need the condition granting context
	ruleEditor: () => null,
	rule: targetsDoNotIncludeSource,
};
