import { FormInput } from 'src/components/form-input';
import { Defense } from 'src/types/types';

export function Defenses({ defenses }: { defenses: Record<Defense, number> }) {
	return (
		<>
			<h2 className="text-lg">Defenses</h2>
			<div className="flex flex-wrap gap-1 text-lg">
				<FormInput className="w-8">
					<FormInput.FieldButton className="text-center">{defenses.ac}</FormInput.FieldButton>
					<FormInput.Label>AC</FormInput.Label>
				</FormInput>
				<FormInput className="w-8">
					<FormInput.FieldButton className="text-center">{defenses.fort}</FormInput.FieldButton>
					<FormInput.Label>Fort</FormInput.Label>
				</FormInput>
				<FormInput className="w-8">
					<FormInput.FieldButton className="text-center">{defenses.refl}</FormInput.FieldButton>
					<FormInput.Label>Refl</FormInput.Label>
				</FormInput>
				<FormInput className="w-8">
					<FormInput.FieldButton className="text-center">{defenses.will}</FormInput.FieldButton>
					<FormInput.Label>Will</FormInput.Label>
				</FormInput>
			</div>
		</>
	);
}
