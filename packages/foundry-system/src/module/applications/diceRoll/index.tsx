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
import { isGame } from '../../../core/foundry';
import { evaluateAndRoll } from '../../bonuses/evaluateAndRoll';
import { sendChatMessage } from '../../chat/sendChatMessage';
import { roll } from './roll';

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

		const result = (
			await roll(dice, { actor: baseParams.actor, item: tool }, sendToChat ? baseParams.actor : undefined)
		).total;
		if (result !== undefined) resolve(result);
	}
};

applicationRegistry.attackRoll = ({ defense, ...baseParams }, resolve) => {
	return [displayDialog(baseParams, onRoll), `${baseParams.title} Attack`, { resizable: true }];

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

		// TODO: check each target for extra bonuses/penalties, like combat advantage?

		const targets = isGame(game) && game.user ? Array.from(game.user.targets) : [];
		if (targets.length === 0) {
			await roll(dice, { actor: baseParams.actor, item: tool }, baseParams.actor);
			resolve(null);
		} else {
			const targetRolls = await Promise.all(
				targets.map(async (target) => {
					const rollResult = await roll(dice, { actor: baseParams.actor, item: tool });
					return { target, roll: rollResult.toJSON() as never };
				})
			);
			await sendChatMessage('attackResult', baseParams.actor, {
				results: targetRolls,
				defense,
			});
			resolve(null);
		}
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

		await roll(dice, { actor: baseParams.actor, item: tool }, baseParams.actor);
		resolve(null);
	}
};
