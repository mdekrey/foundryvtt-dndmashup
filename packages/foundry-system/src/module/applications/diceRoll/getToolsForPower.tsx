import {
	EquipmentDocument,
	isEquipment,
	ItemDocument,
	ActorDocument,
	PowerDocument,
	EquippedItemSlot,
} from '@foundryvtt-dndmashup/mashup-react';
import { intersection } from 'lodash/fp';

export const toolKeywords = ['weapon', 'implement'] as const;
export const heldSlots: EquippedItemSlot[] = ['primary-hand', 'off-hand'];

export function getToolsForPower(actor: ActorDocument, power: PowerDocument) {
	const toolType =
		(power
			? (intersection(toolKeywords, power.data.data.keywords)[0] as typeof toolKeywords[number] | undefined)
			: null) ?? null;
	const usesTool = toolType !== null;
	if (!usesTool) return undefined;
	return (actor.items.contents as ItemDocument[])
		.filter(isEquipment)
		.filter((eq) => eq.data.data.equipped.some((slot) => heldSlots.includes(slot)))
		.filter((heldItem) => heldItem.data.data.itemSlot === toolType) as EquipmentDocument<'weapon' | 'implement'>[];
}
