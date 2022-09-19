import { BaseDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { ConditionRuleContext, conditionsRegistry } from '@foundryvtt-dndmashup/mashup-rules';

declare global {
	interface ConditionGrantingContext {
		activeEffectSources: BaseDocument[];
	}
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface ConditionRulesRuntimeParameters {
		// TODO: targets
	}
}

export function targetsDoNotIncludeSource(
	{ activeEffectSources }: ConditionRuleContext,
	parameter: null,
	runtime: Partial<ConditionRulesRuntimeParameters>
) {
	console.log(targetsDoNotIncludeSource.name, { activeEffectSources, parameter, runtime });
	// TODO
	return false;
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
