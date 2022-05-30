import { FormInput } from 'src/components/form-input';
import { SpecificActor } from '../mashup-actor';

export function ActionPoints({ actor }: { actor: SpecificActor }) {
	return (
		<>
			<h2 className="text-lg">Action Points</h2>
			<FormInput className="w-16 flex flex-col items-center">
				<FormInput.AutoNumberField<SpecificActor> field="data.actionPoints.value" className="text-lg text-center" />
				<FormInput.Label>Current</FormInput.Label>
			</FormInput>
			<FormInput className="mt-2">
				<FormInput.Checkbox<SpecificActor> field="data.actionPoints.usedThisEncounter" />
				Used
			</FormInput>
		</>
	);
}
