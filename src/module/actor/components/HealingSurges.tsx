import { FormInput } from 'src/components/form-input';
import { SpecificActor } from '../mashup-actor';

export function HealingSurges({ actor }: { actor: SpecificActor }) {
	return (
		<>
			<h2 className="text-lg">Healing Surges</h2>
			<div>
				<span>Value: {actor.data.data.health.surges.value}</span>
				{' / '}
				<label>
					<FormInput.AutoCheckbox document={actor} field="data.health.secondWindUsed" className="px-1" />
					Second Wind Used
				</label>
			</div>
			<div className="flex justify-start items-center gap-1 flex-grow">
				<FormInput className="w-16 inline-block">
					<FormInput.AutoNumberField
						document={actor}
						field="data.health.surges.remaining"
						className="text-lg text-center"
					/>
					<FormInput.Label>Remaining</FormInput.Label>
				</FormInput>
				<span className="text-lg pb-4">/ {actor.data.data.health.surges.max}</span>
			</div>
		</>
	);
}
