import { FormInput } from 'src/components/form-input';
import { WeaponProperty } from './types';
import { OtherDetails } from '../other/details';
import { toNumericSelectItems, toSelectItems } from '../toSelectItems';
import { weaponCategories, weaponGroups, weaponHands, weaponProperties } from './config';
import { Lens } from 'src/core/lens';
import { defaultEquipmentInfo } from './weaponEquipmentInfo';
import { Stateful } from 'src/components/form-input/hooks/useDocumentAsState';
import { EquipmentData } from '../../dataSourceData';
import { SimpleDocumentData } from 'src/core/interfaces/simple-document';

const allWeaponCategories = toSelectItems(weaponCategories);
const allWeaponHands = toNumericSelectItems(weaponHands);
const allWeaponGroups = toSelectItems(weaponGroups);
const allWeaponProperties = toSelectItems(weaponProperties);

const baseLens = Lens.identity<SimpleDocumentData<EquipmentData<'weapon'>>>();
const equipmentPropertiesLens = baseLens.toField('data').toField('equipmentProperties').default(defaultEquipmentInfo);

export function WeaponDetails({ itemState }: { itemState: Stateful<SimpleDocumentData<EquipmentData<'weapon'>>> }) {
	const checkedProperties = itemState.value.data.equipmentProperties?.properties ?? [];
	function setChecked(value: WeaponProperty, isChecked: boolean) {
		if (isChecked) {
			if (checkedProperties.includes(value)) return;
			itemState.onChangeValue((draft) => {
				draft.data.equipmentProperties?.properties.push(value);
			});
		} else {
			if (!checkedProperties.includes(value)) return;
			itemState.onChangeValue((draft) => {
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

			<OtherDetails itemState={itemState} />

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
