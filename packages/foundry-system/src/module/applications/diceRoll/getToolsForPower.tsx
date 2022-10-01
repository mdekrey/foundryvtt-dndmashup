import {
	EquipmentDocument,
	isEquipment,
	ActorDocument,
	PowerDocument,
	EquippedItemSlot,
	itemSlots,
} from '@foundryvtt-dndmashup/mashup-react';
import { intersection } from 'lodash/fp';

export const toolKeywords = ['weapon', 'implement'] as const;
export const heldSlots: EquippedItemSlot[] = ['primary-hand', 'off-hand'];

export function getToolsForPower(actor: ActorDocument, power: PowerDocument) {
	const toolType =
		(power
			? (intersection(toolKeywords, power.system.keywords)[0] as typeof toolKeywords[number] | undefined)
			: null) ?? null;
	const isCorrectTool: (heldItem: EquipmentDocument) => heldItem is EquipmentDocument<'weapon' | 'implement'> =
		toolType === 'weapon' ? isWeapon : isImplement(actor.derivedCache.lists.getValue('implements'));
	const usesTool = toolType !== null;
	if (!usesTool) return undefined;
	return actor.items.contents
		.filter(isEquipment)
		.filter((eq) => eq.system.equipped.some((slot) => heldSlots.includes(slot)))
		.filter(isCorrectTool);
}

function isWeapon(item: EquipmentDocument): item is EquipmentDocument<'weapon' | 'implement'> {
	return item.system.itemSlot === 'weapon';
}

const kebab = /[^A-Za-z]+/g;
function isImplement(allowedImplements: string[]) {
	const implementKeywords = allowedImplements.map((keyword) => keyword.toLowerCase().replace(kebab, '-'));
	return (item: EquipmentDocument): item is EquipmentDocument<'weapon' | 'implement'> => {
		if (item.system.itemSlot === 'implement' || item.system.itemSlot === 'weapon') {
			const keywords = itemSlots[item.system.itemSlot]
				.keywords(item.system.equipmentProperties as never)
				.map((keyword) => keyword.toLowerCase().replace(kebab, '-'));
			return keywords.some((k) => implementKeywords.includes(k));
		}
		return false;
	};
}
