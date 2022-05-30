import { FormInput } from 'src/components/form-input';
import { SpecificActor } from '../mashup-actor';

export function Details({ actor }: { actor: SpecificActor }) {
	return (
		<>
			<FormInput.RichText<SpecificActor> field="data.details.biography" />
		</>
	);
}
