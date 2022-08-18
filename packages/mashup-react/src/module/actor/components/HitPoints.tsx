import { FormInput } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { Health } from '../types';
import { ResourceLayout } from './ResourceLayout';

const healthLens = Lens.identity<Health>();

export function HitPoints({ healthState, maxHp }: { healthState: Stateful<Health>; maxHp: number }) {
	return (
		<ResourceLayout
			title="Hit Points"
			body={
				<>
					<FormInput className="w-16">
						<FormInput.NumberField
							{...healthLens.toField('hp').toField('value').apply(healthState)}
							className="text-center"
						/>
						<FormInput.Label>Current</FormInput.Label>
					</FormInput>
					<span className="text-lg pb-4">/ {maxHp}</span>
				</>
			}
			footer={
				<label>
					Temp HP
					<div className="inline-block w-16 pl-2">
						<FormInput.NumberField {...healthLens.toField('temporaryHp').apply(healthState)} className="text-center" />
					</div>
				</label>
			}
		/>
	);
}
