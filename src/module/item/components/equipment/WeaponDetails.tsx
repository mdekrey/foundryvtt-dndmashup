import { FormInput } from 'src/components/form-input';
import { SelectItem } from 'src/components/form-input/auto-select';
import { ItemSlotTemplates, WeaponCategory, WeaponGroup, WeaponProperties } from '../../item-slots';
import { SpecificEquipmentItem } from '../../mashup-item';
import { OtherDetails } from './OtherDetails';
import { toSelectItems } from './toSelectItems';

const weaponCategories: Record<WeaponCategory, string> = {
	simple: 'Simple',
	military: 'Military',
	superior: 'Superior',
};
const weaponHands: Record<ItemSlotTemplates['weapon']['hands'], string> = {
	1: 'One-handed',
	2: 'Two-handed',
};
const weaponGroups: Record<WeaponGroup, string> = {
	axe: 'Axe',
	bow: 'Bow',
	crossbow: 'Crossbow',
	flail: 'Flail',
	hammer: 'Hammer',
	'heavy-blade': 'Heavy Blade',
	'light-blade': 'Light Blade',
	mace: 'Mace',
	pick: 'Pick',
	polearm: 'Polearm',
	sling: 'Sling',
	spear: 'Spear',
	staff: 'Staff',
	unarmed: 'Unarmed',
};
const weaponProperties: Record<WeaponProperties, string> = {
	'heavy-thrown': 'Heavy Thrown',
	'high-crit': 'High Crit',
	'light-thrown': 'Light Thrown',
	load: 'Load',
	'off-hand': 'Off Hand',
	reach: 'Reach',
	small: 'Small',
	versatile: 'Versatile',
};
const allWeaponCategories = toSelectItems(weaponCategories);
const allWeaponHands = toSelectItems(weaponHands);
const allWeaponGroups = toSelectItems(weaponGroups);
const allWeaponProperties = toSelectItems(weaponProperties);

export function WeaponDetails({ item }: { item: SpecificEquipmentItem<'weapon'> }) {
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
					<FormInput key={key} className="whitespace-normal">
						{/* TODO */}
						{/* <input type="checkbox" name="properties.{{type}}" {{checked (lookup ../properties type)}}/> {{ name }} */}
					</FormInput>
				))}
			</div>
		</>
	);
}
