import { FormInput } from 'src/components/form-input';
import { SpecificEquipmentItem } from 'src/module/item/mashup-item';

export function OtherDetails({ item }: { item: SpecificEquipmentItem }) {
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
