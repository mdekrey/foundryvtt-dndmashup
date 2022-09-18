import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import {
	emptyInstantaneousEffect,
	InstantaneousEffect,
	InstantaneousEffectFields,
	isEmptyInstantaneousEffect,
} from '@foundryvtt-dndmashup/mashup-rules';

export type AttackEffectTrigger = 'hit' | 'critical-hit';

const lensStarter = Lens.fromProp<Partial<Record<AttackEffectTrigger, InstantaneousEffect>>>();
const defaulter = Lens.identity<InstantaneousEffect | undefined>().default(
	emptyInstantaneousEffect,
	isEmptyInstantaneousEffect
);
const hitLens = lensStarter('hit').combine(defaulter);
const criticalHitLens = lensStarter('critical-hit').combine(defaulter);

export function AttackEffects({
	fallbackImage,
	...state
}: { fallbackImage?: string | null } & Stateful<Partial<Record<AttackEffectTrigger, InstantaneousEffect>>>) {
	return (
		<div>
			<InstantaneousEffectFields fallbackImage={fallbackImage} prefix="Hit" {...hitLens.apply(state)} />
			<InstantaneousEffectFields
				fallbackImage={fallbackImage}
				prefix="Critical Hit"
				{...criticalHitLens.apply(state)}
			/>
		</div>
	);
}
