import { FormInput } from '@foundryvtt-dndmashup/components';
import { Lens } from '@foundryvtt-dndmashup/core';
import { ConditionRuleContext, conditionsRegistry } from '@foundryvtt-dndmashup/mashup-rules';
import { MashupActor } from '../actor';

type StatusEffectConditionParameter = {
	coreStatusId: string;
	label: string | null;
};

declare global {
	interface ConditionRules {
		stance: StatusEffectConditionParameter;
	}
}

function hasStance({ actor }: ConditionRuleContext, { coreStatusId, label }: StatusEffectConditionParameter) {
	if (!(actor instanceof MashupActor)) return false;
	const found = actor.effects.find(
		(e) => e.data.flags?.core?.statusId === coreStatusId && (!label || e.name === label)
	);
	console.log({ actor, found });
	return !!found;
}

const baseLens = Lens.identity<StatusEffectConditionParameter | undefined>().default({
	coreStatusId: '',
	label: null,
});

const coreStatusIdLens = baseLens.toField('coreStatusId');
const labelLens = baseLens.toField('label').default('');

function previewText(parameter?: StatusEffectConditionParameter) {
	return !parameter
		? 'when you have a particular status effect'
		: parameter.label
		? `when your ${parameter.coreStatusId} is ${parameter.label}`
		: `when you are ${parameter.coreStatusId}`;
}

conditionsRegistry.stance = {
	ruleText: previewText,
	ruleEditor: function StatusEffectConditionParameterEditor(state) {
		return (
			<>
				<FormInput className="text-lg">
					<FormInput.TextField {...coreStatusIdLens.apply(state)} />
					<FormInput.Label>Unique Id</FormInput.Label>
					<span className="text-2xs">(others with same ID get removed when applied)</span>
				</FormInput>
				<FormInput className="text-lg">
					<FormInput.TextField {...labelLens.apply(state)} />
					<FormInput.Label>Label Match</FormInput.Label>
					<span className="text-2xs">(must be an exact match)</span>
				</FormInput>
				<p>Preview: {previewText(state.value)}</p>
			</>
		);
	},
	rule: hasStance,
};
