import { FormInput } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { allShieldTypes } from './config';
import { ShieldItemSlotTemplate } from './types';

const shieldTypes = FormInput.Select.recordToSelectItems(allShieldTypes);

const equipmentPropertiesLens = Lens.identity<ShieldItemSlotTemplate>();

export function ShieldDetails({ itemState }: { itemState: Stateful<ShieldItemSlotTemplate> }) {
	return (
		<>
			<FormInput className="col-span-6">
				<FormInput.Select
					{...equipmentPropertiesLens.toField('type').apply(itemState)}
					options={shieldTypes}
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Type</FormInput.Label>
			</FormInput>
			<FormInput className="col-span-4">
				<FormInput.NumberField
					{...equipmentPropertiesLens.toField('shieldBonus').apply(itemState)}
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Shield Bonus</FormInput.Label>
			</FormInput>
			<FormInput className="col-span-4">
				<FormInput.NumberField
					{...equipmentPropertiesLens.toField('checkPenalty').apply(itemState)}
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Check</FormInput.Label>
			</FormInput>
		</>
	);
}
