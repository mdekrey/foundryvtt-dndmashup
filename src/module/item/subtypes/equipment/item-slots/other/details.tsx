import { FormInput } from 'src/components/form-input';
import { MashupItemEquipment } from '../../config';
import { ItemSlot } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function OtherDetails<T extends ItemSlot>({ item }: { item: MashupItemEquipment<T> }) {
	return (
		<>
			<FormInput className="col-span-2">
				<FormInput.Field>
					<span className="w-full input-text flex items-baseline">
						<FormInput.AutoNumberField
							field="data.weight"
							document={item}
							className="text-lg text-center min-w-0 flex-shrink"
							plain
						/>
						lbs.
					</span>
				</FormInput.Field>
				<FormInput.Label>Weight ea.</FormInput.Label>
			</FormInput>
			<FormInput className="col-span-2">
				<FormInput.Field>
					<span className="w-full input-text flex items-baseline">
						<FormInput.AutoNumberField
							field="data.quantity"
							document={item}
							className="text-lg text-center min-w-0 flex-shrink"
							plain
						/>
					</span>
				</FormInput.Field>
				<FormInput.Label>Quantity</FormInput.Label>
			</FormInput>
			<FormInput className="col-span-2">
				<FormInput.Field>
					<span className="w-full input-text flex items-baseline">
						<FormInput.AutoNumberField
							field="data.price"
							document={item}
							className="text-lg text-center min-w-0 flex-shrink"
							plain
						/>
						gp
					</span>
				</FormInput.Field>
				<FormInput.Label>Price</FormInput.Label>
			</FormInput>
		</>
	);
}
