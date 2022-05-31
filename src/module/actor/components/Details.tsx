import { FormInput } from 'src/components/form-input';
import { SpecificActor } from '../mashup-actor';

export function Details({ actor }: { actor: SpecificActor }) {
	return (
		<>
			<FormInput.RichText document={actor} field="data.details.biography" />
		</>
	);
}
