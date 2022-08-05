import {
	applicationRegistry,
	BonusByType,
	DiceRollApplicationParametersBase,
	DiceRoller,
	EquipmentDocument,
	EquippedItemSlot,
	isEquipment,
	ItemDocument,
	RollDetails,
	combineRollComponents,
	fromBonusesToFormula,
} from '@foundryvtt-dndmashup/mashup-react';
import { intersection } from 'lodash/fp';
import { evaluateAndRoll } from '../../bonuses/evaluateAndRoll';
import { MashupDiceContext } from '../../dice/MashupDiceContext';

const toolKeywords = ['weapon', 'implement'] as const;
const heldSlots: EquippedItemSlot[] = ['primary-hand', 'off-hand'];

function displayDialog(
	{ baseDice, actor, relatedPower, rollType }: DiceRollApplicationParametersBase,
	onComplete: (rollProps: RollDetails) => void
) {
	const toolType =
		(relatedPower
			? (intersection(toolKeywords, relatedPower.data.data.keywords)[0] as typeof toolKeywords[number] | undefined)
			: null) ?? null;
	const usesTool = toolType !== null;
	const possibleTools = (actor.items.contents as ItemDocument[])
		.filter(isEquipment)
		.filter((eq) => eq.data.data.equipped.some((slot) => heldSlots.includes(slot)))
		.filter((heldItem) => heldItem.data.data.itemSlot === toolType) as EquipmentDocument<'weapon' | 'implement'>[];

	return (
		<DiceRoller
			actor={actor}
			rollType={rollType}
			baseDice={baseDice}
			onRoll={onComplete}
			runtimeBonusParameters={
				{
					/* TODO - parameters for passing to bonuses to determine if they apply or not */
				}
			}
			evaluateBonuses={evaluateAndRoll}
			possibleTools={usesTool ? possibleTools : undefined}
		/>
	);
}

applicationRegistry.diceRoll = ({ sendToChat, ...baseParams }, resolve) => {
	return [displayDialog(baseParams, onRoll), `Roll: ${baseParams.title}`, { resizable: true }];

	async function onRoll({
		baseDice,
		resultBonusesByType,
		tool,
	}: {
		baseDice: string;
		resultBonusesByType: BonusByType;
		tool?: EquipmentDocument<'weapon' | 'implement'>;
	}) {
		const dice = `${combineRollComponents(baseDice, fromBonusesToFormula(resultBonusesByType))}`;

		const result = await roll(dice, sendToChat, { actor: baseParams.actor, item: tool });
		if (result !== undefined) resolve(result);
	}
};

applicationRegistry.attackRoll = ({ defense, targets, ...baseParams }, resolve) => {
	return [
		displayDialog(baseParams, onRoll),
		`${baseParams.title} Attack: ${targets.length} targets`,
		{ resizable: true },
	];

	async function onRoll({
		baseDice,
		resultBonusesByType,
		tool,
	}: {
		baseDice: string;
		resultBonusesByType: BonusByType;
		tool?: EquipmentDocument<'weapon' | 'implement'>;
	}) {
		const dice = `${combineRollComponents(baseDice, fromBonusesToFormula(resultBonusesByType))}`;

		await roll(dice, true, { actor: baseParams.actor, item: tool });
		resolve(null);
	}
};

applicationRegistry.damage = ({ ...baseParams }, resolve) => {
	return [displayDialog(baseParams, onRoll), `${baseParams.title} Damage`, { resizable: true }];

	async function onRoll({
		baseDice,
		resultBonusesByType,
		tool,
	}: {
		baseDice: string;
		resultBonusesByType: BonusByType;
		tool?: EquipmentDocument<'weapon' | 'implement'>;
	}) {
		const dice = `${combineRollComponents(baseDice, fromBonusesToFormula(resultBonusesByType))}`;

		await roll(dice, true, { actor: baseParams.actor, item: tool });
		resolve(null);
	}
};

async function roll(dice: string, sendToChat: boolean, context: MashupDiceContext): Promise<number | undefined> {
	// Example full formula: 1d20 + 2[ability bonus] + 4[power bonus] + 2[bonus]
	const roll = Roll.create(dice, context);
	await roll.evaluate();

	if (sendToChat) {
		await roll.toMessage();
	}
	if (roll.total !== undefined) return roll.total;
	return undefined;
}
