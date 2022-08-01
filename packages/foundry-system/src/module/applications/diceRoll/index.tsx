import {
	applicationRegistry,
	DiceRoller,
	EquipmentDocument,
	EquippedItemSlot,
	isEquipment,
	ItemDocument,
} from '@foundryvtt-dndmashup/mashup-react';
import { intersection } from 'lodash/fp';
import { MashupDiceContext } from '../../dice/MashupDiceContext';

const toolKeywords = ['weapon', 'implement'] as const;
const heldSlots: EquippedItemSlot[] = ['primary-hand', 'off-hand'];

applicationRegistry.diceRoll = ({ baseDice, title, actor, relatedPower, rollType }, resolve) => {
	const toolType =
		(relatedPower
			? (intersection(toolKeywords, relatedPower.data.data.keywords)[0] as typeof toolKeywords[number] | undefined)
			: null) ?? null;
	const usesTool = toolType !== null;
	const possibleTools = (actor.items.contents as ItemDocument[])
		.filter(isEquipment)
		.filter((eq) => eq.data.data.equipped.some((slot) => heldSlots.includes(slot)))
		.filter((heldItem) => heldItem.data.data.itemSlot === toolType) as EquipmentDocument<'weapon' | 'implement'>[];

	return [
		<DiceRoller
			actor={actor}
			rollType={rollType}
			baseDice={baseDice}
			onRoll={onRoll}
			possibleTools={usesTool ? possibleTools : undefined}
		/>,
		`Roll: ${title}`,
		{ resizable: true },
	];

	async function onRoll({ dice, tool }: { dice: string; tool?: EquipmentDocument<'weapon' | 'implement'> }) {
		// Example full formula: 1d20 + 2[ability bonus] + 4[power bonus] + 2[bonus]
		const rollData: MashupDiceContext = {
			actor: actor,
			item: tool,
		};
		const roll = Roll.create(dice, rollData);
		console.log(roll.formula);
		await roll.evaluate();
		const json = roll.toJSON();
		console.log(roll, json);
		await roll.toMessage();
		if (roll.total !== undefined) resolve(roll.total);
	}
};
