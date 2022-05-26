import { rootPath } from 'src/module/constants';
import { templatePathSharedParts } from 'src/module/bonuses/templates';
import { ItemSlot } from '../item-slots';

const templatePath = `${rootPath}/module/item/templates`;

export const templatePathItemSheet = (type: SourceConfig['Item']['type']) =>
	`${templatePath}/${type}-sheet.html` as const;

export const templatePathItemParts = {
	description: `${templatePath}/parts/description.html` as const,
	...templatePathSharedParts,
};

export const otherEquipmentDetails = `${templatePath}/parts/equipment-details/other.html` as const;

export const templatePathEquipmentParts: Record<ItemSlot, string> = {
	'': otherEquipmentDetails,
	weapon: otherEquipmentDetails,
	shield: otherEquipmentDetails,
	armor: `${templatePath}/parts/equipment-details/armor.html` as const,
	arms: otherEquipmentDetails,
	feet: otherEquipmentDetails,
	hands: otherEquipmentDetails,
	head: otherEquipmentDetails,
	neck: otherEquipmentDetails,
	ring: otherEquipmentDetails,
	waist: otherEquipmentDetails,
};
