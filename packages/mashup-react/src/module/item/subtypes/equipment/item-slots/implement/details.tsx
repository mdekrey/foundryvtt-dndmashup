import { FormInput } from '@foundryvtt-dndmashup/components';
import { ImplementItemSlotTemplate } from './types';
import { implementGroups } from './config';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';

const allImplementGroups = FormInput.Select.recordToSelectItems(implementGroups);

const equipmentPropertiesLens = Lens.identity<ImplementItemSlotTemplate>();

export function ImplementDetails({ itemState }: { itemState: Stateful<ImplementItemSlotTemplate> }) {
	return (
		<>
			<FormInput className="col-span-6">
				<FormInput.Select
					{...equipmentPropertiesLens.toField('group').apply(itemState)}
					options={allImplementGroups}
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Group</FormInput.Label>
			</FormInput>
		</>
	);
}
