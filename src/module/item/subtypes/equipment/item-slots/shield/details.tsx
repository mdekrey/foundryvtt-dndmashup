import { FormInput } from 'src/components/form-input';
import { documentAsState } from 'src/components/form-input/hooks/useDocumentAsState';
import { SourceDataOf } from 'src/core/foundry';
import { Lens } from 'src/core/lens';
import { MashupItemEquipment } from '../../config';
import { OtherDetails } from '../other/details';
import { toSelectItems } from '../toSelectItems';
import { allShieldTypes } from './config';
import { defaultEquipmentInfo } from './sheildEquipmentInfo';

const shieldTypes = toSelectItems(allShieldTypes);

const baseLens = Lens.identity<SourceDataOf<MashupItemEquipment<'shield'>>>();
const equipmentPropertiesLens = baseLens.toField('data').toField('equipmentProperties').default(defaultEquipmentInfo);

export function ShieldDetails({ item }: { item: MashupItemEquipment<'shield'> }) {
	const documentState = documentAsState(item);

	return (
		<>
			<FormInput className="col-span-6">
				<FormInput.Select
					{...equipmentPropertiesLens.toField('type').apply(documentState)}
					options={shieldTypes}
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Type</FormInput.Label>
			</FormInput>
			<FormInput className="col-span-4">
				<FormInput.NumberField
					{...equipmentPropertiesLens.toField('shieldBonus').apply(documentState)}
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Shield Bonus</FormInput.Label>
			</FormInput>
			<FormInput className="col-span-4">
				<FormInput.NumberField
					{...equipmentPropertiesLens.toField('checkPenalty').apply(documentState)}
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Check</FormInput.Label>
			</FormInput>

			<OtherDetails item={item} />
		</>
	);
}
