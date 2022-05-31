import { FormInput } from 'src/components/form-input';
import { SpecificItem } from '../mashup-item';

export function Description({ item }: { item: SpecificItem<'equipment'> }) {
	return (
		<>
			<FormInput.RichText document={item} field="data.description.text" />
		</>
	);
}
