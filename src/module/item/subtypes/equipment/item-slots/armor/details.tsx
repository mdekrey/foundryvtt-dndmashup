import { FormInput } from 'src/components/form-input';
import { ArmorCategory, ArmorType } from '../types';
import { SpecificEquipmentItem } from 'src/module/item/mashup-item';
import { OtherDetails } from '../other/details';
import { toSelectItems } from '../toSelectItems';

const allArmorCategories: Record<ArmorCategory, string> = {
	cloth: 'Cloth',
	leather: 'Leather',
	hide: 'Hide',
	chainmail: 'Chainmail',
	scale: 'Scale',
	plate: 'Plate',
};
const allArmorTypes: Record<ArmorType, string> = {
	light: 'Light',
	heavy: 'Heavy',
};

const armorCategories = toSelectItems(allArmorCategories);
const armorTypes = toSelectItems(allArmorTypes);

export function ArmorDetails({ item }: { item: SpecificEquipmentItem<'armor'> }) {
	return (
		<>
			<FormInput className="col-span-6">
				<FormInput.AutoSelect
					document={item}
					options={armorCategories}
					field="data.equipmentProperties.category"
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Category</FormInput.Label>
			</FormInput>
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
					field="data.equipmentProperties.armorBonus"
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Armor Bonus</FormInput.Label>
			</FormInput>
			<FormInput className="col-span-4">
				<FormInput.AutoNumberField
					document={item}
					field="data.equipmentProperties.checkPenalty"
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Check</FormInput.Label>
			</FormInput>
			<FormInput className="col-span-4">
				<FormInput.AutoNumberField
					document={item}
					field="data.equipmentProperties.speedPenalty"
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Speed</FormInput.Label>
			</FormInput>

			<OtherDetails item={item} />
		</>
	);
}
