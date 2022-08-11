import { FormInput } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/mashup-core';
import { ApplicableEffect, ApplicableEffectFields } from '../../../../../effects';
import { AttackRoll, PowerEffect } from '../dataSourceData';
import { AttackRollFields } from './AttackRollFields';
import { TypeAndRange } from './TypeAndRange';

const powerEffectFieldLens = Lens.fromProp<PowerEffect>();

const nameLens = powerEffectFieldLens('name');
const noteLens = powerEffectFieldLens('note');
const noteLabelLens = powerEffectFieldLens('noteLabel');
export const targetLens = powerEffectFieldLens('target');
export const typeAndRangeLens = powerEffectFieldLens('typeAndRange');
const hitEffectLens = powerEffectFieldLens('hit');

export const attackRollLens = Lens.from<PowerEffect, AttackRoll | null>(
	(powerEffect) => powerEffect.attackRoll ?? null,
	(mutator) => (draft) => {
		const oldAttackRoll = draft.attackRoll ?? null;
		const newAttackRoll = mutator(oldAttackRoll);
		draft.attackRoll = newAttackRoll === undefined ? oldAttackRoll : newAttackRoll;
		if (draft.attackRoll === null) draft.miss = null;
		else if (draft.miss === null) draft.miss = { text: '', healing: null, damage: null };
	}
);

const missEffectLens = Lens.from<PowerEffect, ApplicableEffect>(
	(e) => e.miss ?? { text: '', healing: null, damage: null },
	(mutator) => (draft) => {
		const result = mutator(draft.miss ?? { text: '', healing: null, damage: null });
		if (draft.attackRoll === null) draft.miss = null;
		else if (result !== undefined) draft.miss = result;
		return draft;
	}
);

export function PowerEffectFields(props: Stateful<PowerEffect>) {
	return (
		<>
			<FormInput>
				<FormInput.TextField {...nameLens.apply(props)} />
				<FormInput.Label>Name</FormInput.Label>
			</FormInput>
			<FormInput className="col-span-3">
				<FormInput.TextField {...noteLabelLens.apply(props)} />
				<FormInput.Label>Note Label</FormInput.Label>
			</FormInput>
			<FormInput className="col-span-9">
				<FormInput.TextField {...noteLens.apply(props)} />
				<FormInput.Label>Note</FormInput.Label>
			</FormInput>
			<FormInput>
				<FormInput.TextField {...targetLens.apply(props)} />
				<FormInput.Label>Target</FormInput.Label>
			</FormInput>
			<div className="col-span-8">
				<TypeAndRange {...typeAndRangeLens.apply(props)} />
			</div>
			<AttackRollFields {...attackRollLens.apply(props)} />
			<HitAndMissFields {...props} />
		</>
	);
}

export function HitAndMissFields(props: Stateful<PowerEffect>) {
	return (
		<>
			<ApplicableEffectFields prefix={props.value.miss === null ? 'Effect' : 'Hit'} {...hitEffectLens.apply(props)} />
			{props.value.miss === null ? null : <ApplicableEffectFields prefix="Miss" {...missEffectLens.apply(props)} />}
		</>
	);
}
