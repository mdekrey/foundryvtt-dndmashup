import { FormInput } from 'src/components/form-input';
import { MashupItemEquipment } from '../subtypes/equipment';
import { ItemSlot } from '../subtypes/equipment/item-slots';

export function Description<T extends ItemSlot>({ item }: { item: MashupItemEquipment<T> }) {
	return (
		<>
			<FormInput.RichText document={item} field="data.description.text" />
		</>
	);
}
