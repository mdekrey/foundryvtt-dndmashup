import { FormInput } from 'src/components/form-input';
import { SpecificActor } from '../mashup-actor';

export function Defenses({ actor }: { actor: SpecificActor }) {
	return (
		<>
			<h2 className="text-lg">Defenses</h2>
			<div className="flex flex-wrap gap-1 text-lg">
				<FormInput className="w-8">
					<FormInput.FieldButton className="text-center">{actor.data.data.defenses.ac}</FormInput.FieldButton>
					<FormInput.Label>AC</FormInput.Label>
				</FormInput>
				<FormInput className="w-8">
					<FormInput.FieldButton className="text-center">{actor.data.data.defenses.fort}</FormInput.FieldButton>
					<FormInput.Label>Fort</FormInput.Label>
				</FormInput>
				<FormInput className="w-8">
					<FormInput.FieldButton className="text-center">{actor.data.data.defenses.refl}</FormInput.FieldButton>
					<FormInput.Label>Refl</FormInput.Label>
				</FormInput>
				<FormInput className="w-8">
					<FormInput.FieldButton className="text-center">{actor.data.data.defenses.will}</FormInput.FieldButton>
					<FormInput.Label>Will</FormInput.Label>
				</FormInput>
			</div>
		</>
	);
}
