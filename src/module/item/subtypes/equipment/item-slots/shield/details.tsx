import { FormInput } from 'src/components/form-input';
import { ArmorType } from '../types';
import { SpecificEquipmentItem } from 'src/module/item/mashup-item';
import { OtherDetails } from '../other/details';
import { toSelectItems } from '../toSelectItems';

const allArmorTypes: Record<ArmorType, string> = {
	light: 'Light',
	heavy: 'Heavy',
};

const armorTypes = toSelectItems(allArmorTypes);

export function ShieldDetails({ item }: { item: SpecificEquipmentItem<'shield'> }) {
	return (
		<>
			<FormInput className="col-span-6">
				<FormInput.AutoSelect
					document={item}
					options={armorTypes}
					field="data.equipmentProperties.type"
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Type</FormInput.Label>
			</FormInput>
			<FormInput className="col-span-4">
				<FormInput.AutoNumberField
					document={item}
					field="data.equipmentProperties.shieldBonus"
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Shield Bonus</FormInput.Label>
			</FormInput>
			<FormInput className="col-span-4">
				<FormInput.AutoNumberField
					document={item}
					field="data.equipmentProperties.checkPenalty"
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Check</FormInput.Label>
			</FormInput>

			<OtherDetails item={item} />
		</>
	);
}
