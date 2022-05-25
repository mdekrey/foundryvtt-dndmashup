import { otherEquipmentDetails, templatePathEquipmentParts } from 'src/module/constants';
import { SubItemFunctions } from './sub-item-functions';

const itemSlots = {
	weapon: 'Weapon',
	shield: 'Shield',
	armor: 'Armor',
	arms: 'Arms',
	feet: 'Feet',
	hands: 'Hands',
	head: 'Head',
	neck: 'Neck',
	ring: 'Ring',
	waist: 'Waist',
};
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
	sheetData: (data) => ({
		totalWeight: data.data.weight * data.data.quantity,
		itemSlots,
		armorCategories,
		armorTypes,

		templates: {
			details: () =>
				data.data.itemSlot in templatePathEquipmentParts
					? templatePathEquipmentParts[data.data.itemSlot as keyof typeof templatePathEquipmentParts]
					: otherEquipmentDetails,
		},
	}),
	getSubmitSheetData: (d, item) => {
		if (d.data.itemSlot !== item.data.data.itemSlot) d.data.equipmentProperties = null;
		// d.data.equipmentProperties = {
		// 	...Object.fromEntries(Object.entries(item.data.data.equipmentProperties).map(([k]) => [k, undefined])),
		// 	...d.data.equipmentProperties,
		// };
		console.log(d);
		return d;
	},
};
