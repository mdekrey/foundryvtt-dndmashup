import { FormInput } from 'src/components/form-input';
import { deepUpdate, SourceDataOf } from 'src/core/foundry';
import { WeaponProperty } from './types';
import { OtherDetails } from '../other/details';
import { toNumericSelectItems, toSelectItems } from '../toSelectItems';
import { weaponCategories, weaponGroups, weaponHands, weaponProperties } from './config';
import { MashupItemEquipment } from '../../config';
import { Lens } from 'src/core/lens';
import { defaultEquipmentInfo } from './weaponEquipmentInfo';
import { documentAsState } from 'src/components/form-input/hooks/useDocumentAsState';

const allWeaponCategories = toSelectItems(weaponCategories);
const allWeaponHands = toNumericSelectItems(weaponHands);
const allWeaponGroups = toSelectItems(weaponGroups);
const allWeaponProperties = toSelectItems(weaponProperties);

const baseLens = Lens.identity<SourceDataOf<MashupItemEquipment<'weapon'>>>();
const equipmentPropertiesLens = baseLens.toField('data').toField('equipmentProperties').default(defaultEquipmentInfo);

export function WeaponDetails({ item }: { item: MashupItemEquipment<'weapon'> }) {
	const documentState = documentAsState(item);
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
				<FormInput.Select
					{...equipmentPropertiesLens.toField('category').apply(documentState)}
					options={allWeaponCategories}
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Category</FormInput.Label>
			</FormInput>
			<FormInput className="col-span-6">
				<FormInput.Select
					{...equipmentPropertiesLens.toField('hands').apply(documentState)}
					options={allWeaponHands}
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Hands</FormInput.Label>
			</FormInput>

			<FormInput className="col-span-4">
				<FormInput.NumberField
					{...equipmentPropertiesLens.toField('proficiencyBonus').apply(documentState)}
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Prof.</FormInput.Label>
			</FormInput>
			<FormInput className="col-span-4">
				<FormInput.TextField
					{...equipmentPropertiesLens.toField('damage').apply(documentState)}
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Damage</FormInput.Label>
			</FormInput>
			<FormInput className="col-span-4">
				<FormInput.TextField
					{...equipmentPropertiesLens.toField('range').apply(documentState)}
					className="w-full text-lg text-center"
				/>
				<FormInput.Label>Range</FormInput.Label>
			</FormInput>
			<FormInput className="col-span-6">
				<FormInput.Select
					{...equipmentPropertiesLens.toField('group').apply(documentState)}
					options={allWeaponGroups}
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
