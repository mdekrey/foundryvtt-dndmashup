import { BaseDocument } from '@foundryvtt-dndmashup/foundry-compat';
import {
	ConditionRuleContext,
	ConditionRulesRuntimeParameters,
	conditionsRegistry,
	ruleResultIndeterminate,
} from '@foundryvtt-dndmashup/mashup-rules';
import { ActorDocument, TokenDocument } from '../module';

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
	ruleText: (parameter, context) => {
		if (context && context.activeEffectSources) {
			const actor = context.activeEffectSources.find((s): s is ActorDocument => s.collectionName === 'actors');
			if (actor) {
				return `when the targets do not include ${actor.name}`;
			}
		}
		return 'when the targets do not include the source';
	},
	ruleEditor: () => null,
	rule: targetsDoNotIncludeSource,
};
