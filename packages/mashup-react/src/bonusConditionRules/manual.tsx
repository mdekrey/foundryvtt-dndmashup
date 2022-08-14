import { FormInput } from '@foundryvtt-dndmashup/components';
import { Lens } from '@foundryvtt-dndmashup/core';
import { ruleResultIndeterminate, conditionsRegistry } from '@foundryvtt-dndmashup/mashup-rules';

function manual(): typeof ruleResultIndeterminate {
	return ruleResultIndeterminate;
}

type ManualConditionParameter = { conditionText: string };

declare global {
	interface ConditionRules {
		manual: ManualConditionParameter;
	}
}

const baseLens = Lens.identity<ManualConditionParameter | undefined>().default(
	{ conditionText: '<condition>' as const },
	(p): p is { conditionText: '<condition>' } => p.conditionText === '<condition>'
);

const textLens = baseLens.toField('conditionText');

conditionsRegistry.manual = {
	ruleText: (params) => params?.conditionText ?? '<condition>',
	ruleEditor: function ManualConditionParameterEditor(state) {
		return (
			<FormInput className="text-lg">
				<FormInput.TextField {...textLens.apply(state)} />
				<FormInput.Label>Condition</FormInput.Label>
			</FormInput>
		);
	},
	rule: manual,
};
