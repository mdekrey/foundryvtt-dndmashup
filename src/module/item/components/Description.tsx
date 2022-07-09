import { FormInput } from 'src/components/form-input';
import { EquipmentDocument } from '../subtypes/equipment/dataSourceData';
import { ItemSlot } from '../subtypes/equipment/item-slots';

export function Description<T extends ItemSlot>({ item }: { item: EquipmentDocument<T> }) {
	return (
		<>
			<FormInput.RichText document={item as any} field={'data.description.text' as never} />
		</>
	);
}
