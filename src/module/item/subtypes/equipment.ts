import {
	ArmorCategory,
	ArmorType,
	itemSlots,
	ItemSlotTemplates,
	WeaponCategory,
	WeaponGroup,
	WeaponProperties,
} from '../item-slots';
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

function weaponExtraData(equipmentProperties: ItemSlotTemplates['weapon']) {
	return {
		properties: Object.fromEntries(equipmentProperties.properties.map((p) => [p, true])),
	};
}
function weaponFromExtraData(equipmentProperties: ItemSlotTemplates['weapon'], submittedData: any) {
	if (
		submittedData &&
		typeof submittedData === 'object' &&
		'properties' in submittedData &&
		submittedData.properties &&
		typeof submittedData.properties === 'object'
	) {
		equipmentProperties.properties = Object.entries(submittedData.properties)
			.filter(([, v]) => v)
			.map(([p]) => p as WeaponProperties);
	}
}

export const equipmentConfig: SubItemFunctions<'equipment'> = {
	bonuses: (data) => [
		// TODO: only if equipped and it requires an item slot
		...data.data.grantedBonuses,
	],
	prepare: () => {
		// nothing to prepare
	},
	sheetData: (data) => {
		const equipmentProperties =
			data.data.equipmentProperties ??
			({
				...itemSlots[data.data.itemSlot].defaultEquipmentInfo,
			} as ItemSlotTemplates[keyof ItemSlotTemplates]);
		const itemSlotFunc = itemSlots[data.data.itemSlot];
		const buildSummary =
			'buildSummary' in itemSlotFunc
				? (itemSlotFunc.buildSummary as (param: typeof equipmentProperties) => string)
				: () => `TODO: summary`;
		const extraProperties =
			data.data.itemSlot === 'weapon' ? weaponExtraData(equipmentProperties as ItemSlotTemplates['weapon']) : {};
		return {
			itemData: { equipmentProperties },
			totalWeight: data.data.weight * data.data.quantity,
			itemSlots: itemSlotsDropdown,
			armorCategories,
			armorTypes,
			weaponCategories,
			weaponHands,
			weaponGroups,
			weaponProperties,

			...extraProperties,

			summary: buildSummary(equipmentProperties),

			templates: {
				details: () => templatePathEquipmentParts[data.data.itemSlot as keyof typeof templatePathEquipmentParts],
			},
		};
	},
	getSubmitSheetData: (d, item, sheet) => {
		if (d.data.itemSlot !== item.data.data.itemSlot) {
			d.data.equipmentProperties = null;
			sheet.showDetails();
		} else {
			if (d.data.itemSlot === 'weapon') {
				weaponFromExtraData(d.data.equipmentProperties, d);
			}
		}
		return d;
	},
};
