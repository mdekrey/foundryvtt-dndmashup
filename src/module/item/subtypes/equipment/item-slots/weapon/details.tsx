import { FormInput } from 'src/components/form-input';
import { deepUpdate } from 'src/core/foundry';
import { WeaponProperty } from './types';
import { OtherDetails } from '../other/details';
import { toSelectItems } from '../toSelectItems';
import { weaponCategories, weaponGroups, weaponHands, weaponProperties } from './config';
import { MashupItemEquipment } from '../../config';

const allWeaponCategories = toSelectItems(weaponCategories);
const allWeaponHands = toSelectItems(weaponHands);
const allWeaponGroups = toSelectItems(weaponGroups);
const allWeaponProperties = toSelectItems(weaponProperties);

export function WeaponDetails({ item }: { item: MashupItemEquipment<'weapon'> }) {
	const checkedProperties = item.data._source.data.equipmentProperties?.properties ?? [];
	function setChecked(value: WeaponProperty, isChecked: boolean) {
		if (isChecked) {
			if (checkedProperties.includes(value)) return;
			deepUpdate(item, (draft) => {
				draft.data.equipmentProperties?.properties.push(value);
			});
		} else {
			if (!checkedProperties.includes(value)) return;
			deepUpdate(item, (draft) => {
				if (draft.data.equipmentProperties) {
					draft.data.equipmentProperties.properties = draft.data.equipmentProperties.properties.filter(
						(p) => p !== value
					);
				}
			});
		}
	}
	return (
		<>
			<FormInput className="col-span-6">
				<FormInput.AutoSelect
					document={item}
					options={allWeaponCategories}
					field="data.equipmentProperties.category"
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Category</FormInput.Label>
			</FormInput>
			<FormInput className="col-span-6">
				<FormInput.AutoSelect
					document={item}
					options={allWeaponHands}
					field="data.equipmentProperties.hands"
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Hands</FormInput.Label>
			</FormInput>

			<FormInput className="col-span-4">
				<FormInput.AutoNumberField
					document={item}
					field="data.equipmentProperties.proficiencyBonus"
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Prof.</FormInput.Label>
			</FormInput>
			<FormInput className="col-span-4">
				<FormInput.AutoTextField
					document={item}
					field="data.equipmentProperties.damage"
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Damage</FormInput.Label>
			</FormInput>
			<FormInput className="col-span-4">
				<FormInput.AutoTextField
					document={item}
					field="data.equipmentProperties.range"
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Range</FormInput.Label>
			</FormInput>
			<FormInput className="col-span-6">
				<FormInput.AutoSelect
					document={item}
					options={allWeaponGroups}
					field="data.equipmentProperties.group"
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Group</FormInput.Label>
			</FormInput>

			<OtherDetails item={item} />

			<div className="col-span-12 text-sm grid grid-cols-4">
				{allWeaponProperties.map(({ value, key, label }) => (
					<label key={key} className="whitespace-normal">
						{/* TODO */}
						<input
							type="checkbox"
							checked={checkedProperties.includes(value)}
							onChange={(ev) => setChecked(value, ev.currentTarget.checked)}
						/>{' '}
						{label}
					</label>
				))}
			</div>
		</>
	);
}
