import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { ApplicableEffectFields } from './applicable-effect-fields';
import { ApplicableEffect } from './types';

export type AttackEffectTrigger = 'hit' | 'critical-hit';

const lensStarter = Lens.fromProp<Partial<Record<AttackEffectTrigger, ApplicableEffect>>>();
const defaulter = Lens.identity<ApplicableEffect | undefined>().default(
	{ damage: null, healing: null, text: '' },
	(effect): effect is Exclude<typeof effect, ApplicableEffect> =>
		effect.damage === null && effect.healing === null && effect.text === ''
);
const hitLens = lensStarter('hit').combine(defaulter);
const criticalHitLens = lensStarter('critical-hit').combine(defaulter);

export function AttackEffects(state: Stateful<Partial<Record<AttackEffectTrigger, ApplicableEffect>>>) {
	return (
		<div>
			<ApplicableEffectFields prefix="Hit" {...hitLens.apply(state)} />
			<ApplicableEffectFields prefix="Critical Hit" {...criticalHitLens.apply(state)} />
		</div>
	);
}
