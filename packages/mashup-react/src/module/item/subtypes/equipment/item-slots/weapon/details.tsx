import { FormInput } from '@foundryvtt-dndmashup/components';
import { WeaponItemSlotTemplate, WeaponProperty } from './types';
import { weaponCategories, weaponGroups, weaponHands, weaponProperties } from './config';
import { Lens, Stateful } from '@foundryvtt-dndmashup/mashup-core';

const allWeaponCategories = FormInput.Select.recordToSelectItems(weaponCategories);
const allWeaponHands = FormInput.Select.numericRecordToSelectItems(weaponHands);
const allWeaponGroups = FormInput.Select.recordToSelectItems(weaponGroups);
const allWeaponProperties = FormInput.Select.recordToSelectItems(weaponProperties);

const equipmentPropertiesLens = Lens.identity<WeaponItemSlotTemplate>();

export function WeaponDetails({ itemState }: { itemState: Stateful<WeaponItemSlotTemplate> }) {
	const checkedProperties = itemState.value.properties ?? [];
	function setChecked(value: WeaponProperty, isChecked: boolean) {
		if (isChecked) {
			if (checkedProperties.includes(value)) return;
			itemState.onChangeValue((draft) => {
				if (draft) {
					draft.properties.push(value);
				}
			});
		} else {
			if (!checkedProperties.includes(value)) return;
			itemState.onChangeValue((draft) => {
				if (draft) {
					draft.properties = draft.properties.filter((p) => p !== value);
				}
			});
		}
	}
	return (
		<>
			<FormInput className="col-span-6">
				<FormInput.Select
					{...equipmentPropertiesLens.toField('category').apply(itemState)}
					options={allWeaponCategories}
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Category</FormInput.Label>
			</FormInput>
			<FormInput className="col-span-6">
				<FormInput.Select
					{...equipmentPropertiesLens.toField('hands').apply(itemState)}
					options={allWeaponHands}
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Hands</FormInput.Label>
			</FormInput>

			<FormInput className="col-span-4">
				<FormInput.NumberField
					{...equipmentPropertiesLens.toField('proficiencyBonus').apply(itemState)}
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Prof.</FormInput.Label>
			</FormInput>
			<FormInput className="col-span-4">
				<FormInput.TextField
					{...equipmentPropertiesLens.toField('damage').apply(itemState)}
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Damage</FormInput.Label>
			</FormInput>
			<FormInput className="col-span-4">
				<FormInput.TextField
					{...equipmentPropertiesLens.toField('range').apply(itemState)}
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Range</FormInput.Label>
			</FormInput>
			<FormInput className="col-span-6">
				<FormInput.Select
					{...equipmentPropertiesLens.toField('group').apply(itemState)}
					options={allWeaponGroups}
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Group</FormInput.Label>
			</FormInput>

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
