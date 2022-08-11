import { FormInput } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/mashup-core';
import { DamageFields } from './DamageFields';
import { ApplicableEffect } from './types';

const applicableEffectFieldLens = Lens.fromProp<ApplicableEffect>();

const damageEffectLens = applicableEffectFieldLens('damage');
const effectTextLens = applicableEffectFieldLens('text');
// const healingEffectLens = applicableEffectFieldLens('healing');

export function ApplicableEffectFields({ prefix, ...props }: { prefix?: string } & Stateful<ApplicableEffect>) {
	return (
		<>
			<DamageFields prefix={prefix} {...damageEffectLens.apply(props)} />
			{/* TODO: Healing */}
			<FormInput>
				<FormInput.TextField {...effectTextLens.apply(props)} />
				<FormInput.Label>{prefix}</FormInput.Label>
			</FormInput>
		</>
	);
}
