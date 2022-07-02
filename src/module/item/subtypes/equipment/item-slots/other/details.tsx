import { FormInput } from 'src/components/form-input';
import { MashupItemEquipment } from '../../config';
import { ItemSlot } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function OtherDetails<T extends ItemSlot>({ item }: { item: MashupItemEquipment<T> }) {
	return (
		<>
			<FormInput className="text-lg col-span-2">
				<FormInput.Structured>
					<FormInput.Structured.Main>
						<FormInput.AutoNumberField field="data.weight" document={item} plain />
					</FormInput.Structured.Main>
					lbs.
				</FormInput.Structured>
				<FormInput.Label>Weight ea.</FormInput.Label>
			</FormInput>
			<FormInput className="text-lg col-span-2">
				<FormInput.AutoNumberField field="data.quantity" document={item} />
				<FormInput.Label>Quantity</FormInput.Label>
			</FormInput>
			<FormInput className="text-lg col-span-2">
				<FormInput.Structured>
					<FormInput.Structured.Main>
						<FormInput.AutoNumberField field="data.price" document={item} plain />
					</FormInput.Structured.Main>
					gp
				</FormInput.Structured>
				<FormInput.Label>Price</FormInput.Label>
			</FormInput>
		</>
	);
}
