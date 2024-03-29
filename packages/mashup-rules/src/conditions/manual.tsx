import { FormInput } from '@foundryvtt-dndmashup/components';
import { Lens } from '@foundryvtt-dndmashup/core';
import { ruleResultIndeterminate } from './types';
import { conditionsRegistry } from './registry';

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
	ruleText: (params) => (params?.conditionText ? `when ${params.conditionText}` : 'when <condition>'),
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
