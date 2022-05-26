import { ArmorCategory, ArmorType, itemSlots, ItemSlotTemplates, WeaponCategory, WeaponGroup } from '../item-slots';
import { templatePathEquipmentParts } from '../templates/template-paths';
import { SubItemFunctions } from './sub-item-functions';

const itemSlotsDropdown = Object.fromEntries(Object.entries(itemSlots).map(([k, v]) => [k, v.label]));
const armorCategories: Record<ArmorCategory, string> = {
	cloth: 'Cloth',
	leather: 'Leather',
	hide: 'Hide',
	chainmail: 'Chainmail',
	scale: 'Scale',
	plate: 'Plate',
};
const armorTypes: Record<ArmorType, string> = {
	light: 'Light',
	heavy: 'Heavy',
};
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

export const equipmentConfig: SubItemFunctions<'equipment'> = {
	bonuses: () => [],
	prepare: () => {
		// nothing to prepare
	},
	sheetData: (data) => {
		const equipmentProperties =
			data.data.equipmentProperties ??
			({
				...itemSlots[data.data.itemSlot].defaultEquipmentInfo,
			} as ItemSlotTemplates[keyof ItemSlotTemplates]);
		return {
			itemData: { equipmentProperties },
			totalWeight: data.data.weight * data.data.quantity,
			itemSlots: itemSlotsDropdown,
			armorCategories,
			armorTypes,
			weaponCategories,
			weaponHands,
			weaponGroups,

			templates: {
				details: () => templatePathEquipmentParts[data.data.itemSlot as keyof typeof templatePathEquipmentParts],
			},
		};
	},
	getSubmitSheetData: (d, item) => {
		if (d.data.itemSlot !== item.data.data.itemSlot) {
			d.data.equipmentProperties = null;
		}
		return d;
	},
};
