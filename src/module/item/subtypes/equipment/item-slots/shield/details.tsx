import { FormInput } from 'src/components/form-input';
import { MashupItemEquipment } from '../../config';
import { OtherDetails } from '../other/details';
import { toSelectItems } from '../toSelectItems';
import { allShieldTypes } from './config';

const shieldTypes = toSelectItems(allShieldTypes);

export function ShieldDetails({ item }: { item: MashupItemEquipment<'shield'> }) {
	return (
		<>
			<FormInput className="col-span-6">
				<FormInput.AutoSelect
					document={item}
					options={shieldTypes}
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
