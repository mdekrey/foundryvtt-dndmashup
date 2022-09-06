import {
	EquipmentDocument,
	isEquipment,
	ItemDocument,
	ActorDocument,
	PowerDocument,
	EquippedItemSlot,
	WeaponItemSlotTemplate,
	ImplementItemSlotTemplate,
} from '@foundryvtt-dndmashup/mashup-react';
import { intersection } from 'lodash/fp';

export const toolKeywords = ['weapon', 'implement'] as const;
export const heldSlots: EquippedItemSlot[] = ['primary-hand', 'off-hand'];

export function getToolsForPower(actor: ActorDocument, power: PowerDocument) {
	const toolType =
		(power
			? (intersection(toolKeywords, power.data.data.keywords)[0] as typeof toolKeywords[number] | undefined)
			: null) ?? null;
	const isCorrectTool: (heldItem: EquipmentDocument) => heldItem is EquipmentDocument<'weapon' | 'implement'> =
		toolType === 'weapon'
			? isWeapon
			: isImplement(
					actor.allDynamicListResult.filter((list) => list.target === 'implements').map((list) => list.entry)
			  );
	const usesTool = toolType !== null;
	if (!usesTool) return undefined;
	return (actor.items.contents as ItemDocument[])
		.filter(isEquipment)
		.filter((eq) => eq.data.data.equipped.some((slot) => heldSlots.includes(slot)))
		.filter(isCorrectTool);
}

function isWeapon(item: EquipmentDocument): item is EquipmentDocument<'weapon' | 'implement'> {
	return item.data.data.itemSlot === 'weapon';
}

function isImplement(allowedImplements: string[]) {
	return (item: EquipmentDocument): item is EquipmentDocument<'weapon' | 'implement'> => {
		if (item.data.data.itemSlot === 'implement' || item.data.data.itemSlot === 'weapon')
			return allowedImplements.includes(
				(item.data.data.equipmentProperties as WeaponItemSlotTemplate | ImplementItemSlotTemplate).group
			);
		return false;
	};
}
