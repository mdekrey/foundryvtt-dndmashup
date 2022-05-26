import { itemSlots, ItemSlotTemplates } from '../item-slots';
import { templatePathEquipmentParts } from '../templates/template-paths';
import { SubItemFunctions } from './sub-item-functions';

const itemSlotsDropdown = Object.fromEntries(Object.entries(itemSlots).map(([k, v]) => [k, v.label]));
const armorCategories = {
	cloth: 'Cloth',
	leather: 'Leather',
	hide: 'Hide',
	chain: 'Chain',
	scale: 'Scale',
	plate: 'Plate',
};
const armorTypes = {
	light: 'Light',
	heavy: 'Heavy',
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
