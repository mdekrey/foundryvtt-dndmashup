import { FormInput } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/mashup-core';
import { allArmorCategories, allArmorTypes } from './config';
import { ArmorItemSlotTemplate } from './types';

const armorCategories = FormInput.Select.recordToSelectItems(allArmorCategories);
const armorTypes = FormInput.Select.recordToSelectItems(allArmorTypes);

const equipmentPropertiesLens = Lens.identity<ArmorItemSlotTemplate>();
const categoryLens = equipmentPropertiesLens.toField('category');
const typeLens = equipmentPropertiesLens.toField('type');
const armorBonusLens = equipmentPropertiesLens.toField('armorBonus');
const checkPenaltyLens = equipmentPropertiesLens.toField('checkPenalty');
const speedPenaltyLens = equipmentPropertiesLens.toField('speedPenalty');

export function ArmorDetails({ itemState }: { itemState: Stateful<ArmorItemSlotTemplate> }) {
	return (
		<>
			<FormInput className="text-lg col-span-6">
				<FormInput.Select {...categoryLens.apply(itemState)} options={armorCategories} />
				<FormInput.Label>Category</FormInput.Label>
			</FormInput>
			<FormInput className="text-lg col-span-6">
				<FormInput.Select {...typeLens.apply(itemState)} options={armorTypes} />
				<FormInput.Label>Type</FormInput.Label>
			</FormInput>
			<FormInput className="text-lg col-span-4">
				<FormInput.NumberField {...armorBonusLens.apply(itemState)} />
				<FormInput.Label>Armor Bonus</FormInput.Label>
			</FormInput>
			<FormInput className="text-lg col-span-4">
				<FormInput.NumberField {...checkPenaltyLens.apply(itemState)} />
				<FormInput.Label>Check</FormInput.Label>
			</FormInput>
			<FormInput className="text-lg col-span-4">
				<FormInput.NumberField {...speedPenaltyLens.apply(itemState)} />
				<FormInput.Label>Speed</FormInput.Label>
			</FormInput>
		</>
	);
}
