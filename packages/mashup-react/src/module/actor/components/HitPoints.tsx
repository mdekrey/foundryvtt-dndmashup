import { FormInput } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/mashup-core';
import { Health } from '../types';

const healthLens = Lens.identity<Health>();

export function HitPoints({ healthState, maxHp }: { healthState: Stateful<Health>; maxHp: number }) {
	return (
		<>
			<h2 className="text-lg">Hit Points</h2>
			<div className="flex justify-start items-center gap-1 text-lg">
				<FormInput className="w-16">
					<FormInput.NumberField {...healthLens.toField('currentHp').apply(healthState)} className="text-center" />
					<FormInput.Label>Current</FormInput.Label>
				</FormInput>
				<span className="text-lg pb-4">/ {maxHp}</span>
			</div>
			<label>
				Temp HP
				<div className="inline-block w-16 pl-2">
					<FormInput.NumberField {...healthLens.toField('temporaryHp').apply(healthState)} className="text-center" />
				</div>
			</label>
		</>
	);
}
