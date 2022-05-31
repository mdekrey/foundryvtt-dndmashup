import { itemSlots, ItemSlotTemplates, WeaponProperty } from '../item-slots';
import { templatePathEquipmentParts } from '../templates/template-paths';
import { SubItemFunctions } from './sub-item-functions';

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
			.map(([p]) => p as WeaponProperty);
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
