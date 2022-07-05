import { FormInput } from 'src/components/form-input';
import { Lens } from 'src/core/lens';
import { Stateful } from 'src/components/form-input/hooks/useDocumentAsState';
import { Health } from '../types';

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
		<>
			<h2 className="text-lg">Healing Surges</h2>
			<div>
				<span>Value: {healingSurgeValue}</span>
				{' / '}
				<FormInput.Inline>
					<FormInput.Checkbox {...healthLens.toField('secondWindUsed').apply(healthState)} />
					<span className="whitespace-nowrap">Second Wind Used</span>
				</FormInput.Inline>
			</div>
			<div className="flex justify-start items-center gap-1 flex-grow">
				<FormInput className="w-16 inline-block">
					<FormInput.NumberField
						{...healthLens.toField('surges').toField('remaining').apply(healthState)}
						className="text-lg text-center"
					/>
					<FormInput.Label>Remaining</FormInput.Label>
				</FormInput>
				<span className="text-lg pb-4">/ {healingSurgesPerDay}</span>
			</div>
		</>
	);
}
