import { FormInput } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { Health } from '../types';
import { ResourceLayout } from './ResourceLayout';

const healthLens = Lens.identity<Health>();

export function HealingSurges({
	healthState,
	healingSurgeValue,
	healingSurgesPerDay,
}: {
	healthState: Stateful<Health>;
	healingSurgeValue: number;
	healingSurgesPerDay: number;
}) {
	return (
		<ResourceLayout
			title="Healing Surges"
			body={
				<>
					<FormInput className="w-16 inline-block">
						<FormInput.NumberField
							{...healthLens.toField('surgesRemaining').toField('value').apply(healthState)}
							className="text-lg text-center"
						/>
						<FormInput.Label>Remaining</FormInput.Label>
					</FormInput>
					<span className="text-lg">/ {healingSurgesPerDay}</span>
				</>
			}
			footer={
				<>
					<span>Value: {healingSurgeValue}</span>
					<span className="inline-block w-8"> </span>
					<FormInput.Inline>
						<FormInput.Checkbox {...healthLens.toField('secondWindUsed').apply(healthState)} />
						<span className="whitespace-nowrap">Second Wind Used</span>
					</FormInput.Inline>
				</>
			}
		/>
	);
}
