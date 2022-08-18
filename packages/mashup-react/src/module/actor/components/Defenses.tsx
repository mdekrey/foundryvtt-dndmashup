import { FormInput } from '@foundryvtt-dndmashup/components';
import { Defense } from '@foundryvtt-dndmashup/mashup-rules';
import { ResourceLayout } from './ResourceLayout';

export function Defenses({ defenses }: { defenses: Record<Defense, number> }) {
	return (
		<ResourceLayout
			title="Defenses"
			body={
				<>
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
				</>
			}
		/>
	);
}
