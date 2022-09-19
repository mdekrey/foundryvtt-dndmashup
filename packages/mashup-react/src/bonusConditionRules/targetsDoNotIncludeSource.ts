import { BaseDocument } from '@foundryvtt-dndmashup/foundry-compat';
import {
	ConditionRuleContext,
	ConditionRulesRuntimeParameters,
	conditionsRegistry,
} from '@foundryvtt-dndmashup/mashup-rules';
import { TokenDocument } from '../module';

declare global {
	interface ConditionGrantingContext {
		activeEffectSources: BaseDocument[];
	}
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface ConditionRulesAllRuntimeParameters {
		targets: TokenDocument[];
	}
}

export function targetsDoNotIncludeSource(
	{ activeEffectSources }: ConditionRuleContext,
	parameter: null,
	runtime: ConditionRulesRuntimeParameters
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
