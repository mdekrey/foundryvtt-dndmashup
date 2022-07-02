import { FormInput } from 'src/components/form-input';
import { documentAsState } from 'src/components/form-input/hooks/useDocumentAsState';
import { SourceDataOf } from 'src/core/foundry';
import { Lens } from 'src/core/lens';
import { MashupItemEquipment } from '../../config';
import { OtherDetails } from '../other/details';
import { toSelectItems } from '../toSelectItems';
import { defaultEquipmentInfo } from './armorEquipmentInfo';
import { allArmorCategories, allArmorTypes } from './config';

const armorCategories = toSelectItems(allArmorCategories);
const armorTypes = toSelectItems(allArmorTypes);

const identityLens = Lens.identity<SourceDataOf<MashupItemEquipment<'armor'>>>();
const equipmentPropertiesLens = identityLens
	.toField('data')
	.toField('equipmentProperties')
	.default(defaultEquipmentInfo);
const categoryLens = equipmentPropertiesLens.toField('category');
const typeLens = equipmentPropertiesLens.toField('type');
const armorBonusLens = equipmentPropertiesLens.toField('armorBonus');
const checkPenaltyLens = equipmentPropertiesLens.toField('checkPenalty');
const speedPenaltyLens = equipmentPropertiesLens.toField('speedPenalty');

export function ArmorDetails({ item }: { item: MashupItemEquipment<'armor'> }) {
	const documentState = documentAsState(item, { deleteData: true });
	return (
		<>
			<FormInput className="text-lg col-span-6">
				<FormInput.Select {...categoryLens.apply(documentState)} options={armorCategories} />
				<FormInput.Label>Category</FormInput.Label>
			</FormInput>
			<FormInput className="text-lg col-span-6">
				<FormInput.Select {...typeLens.apply(documentState)} options={armorTypes} />
				<FormInput.Label>Type</FormInput.Label>
			</FormInput>
			<FormInput className="text-lg col-span-4">
				<FormInput.NumberField {...armorBonusLens.apply(documentState)} />
				<FormInput.Label>Armor Bonus</FormInput.Label>
			</FormInput>
			<FormInput className="text-lg col-span-4">
				<FormInput.NumberField {...checkPenaltyLens.apply(documentState)} />
				<FormInput.Label>Check</FormInput.Label>
			</FormInput>
			<FormInput className="text-lg col-span-4">
				<FormInput.NumberField {...speedPenaltyLens.apply(documentState)} />
				<FormInput.Label>Speed</FormInput.Label>
			</FormInput>

			<OtherDetails item={item} />
		</>
	);
}
