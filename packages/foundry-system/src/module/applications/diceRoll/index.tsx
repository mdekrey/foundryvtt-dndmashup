import { RollJson, toMashupId } from '@foundryvtt-dndmashup/foundry-compat';
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
	DiceRollerOptionalProps,
} from '@foundryvtt-dndmashup/mashup-react';
import { intersection } from 'lodash/fp';
import { applicationDispatcher } from '../../../components/foundry/apps-provider';
import { isGame } from '../../../core/foundry';
import { evaluateAndRoll } from '../../bonuses/evaluateAndRoll';
import { sendChatMessage } from '../../chat/sendChatMessage';
import { roll } from './roll';

const toolKeywords = ['weapon', 'implement'] as const;
const heldSlots: EquippedItemSlot[] = ['primary-hand', 'off-hand'];

type DisplayDialogProps = DiceRollApplicationParametersBase & {
	tool?: EquipmentDocument<'weapon' | 'implement'>;
};

function displayDialog<T extends string>(
	props: DisplayDialogProps,
	onComplete: (rollProps: RollDetails) => void,
	optionalProps: DiceRollerOptionalProps<T>
): JSX.Element;
function displayDialog(props: DisplayDialogProps, onComplete: (rollProps: RollDetails) => void): JSX.Element;
function displayDialog<T extends string = string>(
	{ baseDice, actor, relatedPower, rollType, tool }: DisplayDialogProps,
	onComplete: (rollProps: RollDetails) => void,
	optionalProps?: DiceRollerOptionalProps<T>
) {
	const toolType =
		(relatedPower
			? (intersection(toolKeywords, relatedPower.data.data.keywords)[0] as typeof toolKeywords[number] | undefined)
			: null) ?? null;
	const usesTool = toolType !== null;
	const possibleTools = tool
		? [tool]
		: ((actor.items.contents as ItemDocument[])
				.filter(isEquipment)
				.filter((eq) => eq.data.data.equipped.some((slot) => heldSlots.includes(slot)))
				.filter((heldItem) => heldItem.data.data.itemSlot === toolType) as EquipmentDocument<'weapon' | 'implement'>[]);

	return (
		<DiceRoller
			{...(optionalProps as any)}
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

applicationRegistry.diceRoll = async ({ sendToChat, ...baseParams }, resolve) => {
	return {
		content: displayDialog(baseParams, onRoll),
		title: `Roll: ${baseParams.title}`,
		options: { resizable: true },
	};

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

applicationRegistry.attackRoll = async ({ defense, ...baseParams }, resolve) => {
	return {
		content: displayDialog(baseParams, onRoll),
		title: `${baseParams.title} Attack`,
		options: { resizable: true },
	};

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
		const targetRolls =
			targets.length === 0
				? [{ roll: (await roll(dice, { actor: baseParams.actor, item: tool })).toJSON() as never }]
				: await Promise.all(
						targets.map(async (target) => {
							const rollResult = await roll(dice, { actor: baseParams.actor, item: tool });
							return { target, roll: rollResult.toJSON() as never };
						})
				  );
		await sendChatMessage('attackResult', baseParams.actor, {
			results: targetRolls,
			defense,
			powerId: toMashupId(baseParams.relatedPower),
			flavor: `${baseParams.relatedPower.name} ${baseParams.title} Attack vs. ${defense.toUpperCase()}${
				tool ? ` using ${tool.name}` : ''
			}`,
		});
		resolve(null);
	}
};

applicationRegistry.damage = async ({ damageTypes, ...baseParams }, resolve, reject) => {
	return {
		content: displayDialog(baseParams, onRoll, {
			otherActions: { critical: { content: 'Critical!' } },
			onOtherAction: onCritical,
		}),
		title: `${baseParams.title} Critical Damage`,
		options: { resizable: true },
	};

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

		const resultRoll = await roll(dice, { actor: baseParams.actor, item: tool });

		const result = resultRoll.toJSON() as never as RollJson;

		await sendChatMessage('damageResult', baseParams.actor, {
			result,
			damageTypes,
			powerId: toMashupId(baseParams.relatedPower),
			flavor: `${baseParams.relatedPower.name} ${baseParams.title} Damage${tool ? ` using ${tool.name}` : ''}`,
		});
		resolve(null);
	}

	async function onCritical(
		type: 'critical',
		{
			baseDice,
			resultBonusesByType,
			tool,
		}: {
			baseDice: string;
			resultBonusesByType: BonusByType;
			tool?: EquipmentDocument<'weapon' | 'implement'>;
		}
	) {
		const dice = `${combineRollComponents(baseDice, fromBonusesToFormula(resultBonusesByType))}`;

		const resultRoll = await roll(dice, { actor: baseParams.actor, item: tool }, undefined, { maximize: true });

		const { result } = await applicationDispatcher.launchApplication('criticalDamage', {
			...baseParams,
			baseDice: `${resultRoll.total}`,
			rollType: 'critical-damage',
			damageTypes,
			tool,
		});
		result.then(resolve, reject);
	}
};

applicationRegistry.criticalDamage = async ({ damageTypes, ...baseParams }, resolve) => {
	console.log(baseParams);
	return {
		content: displayDialog(baseParams, onRoll),
		title: `${baseParams.title} Critical Damage`,
		options: { resizable: true },
	};

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

		const resultRoll = await roll(dice, { actor: baseParams.actor, item: tool });

		const result = resultRoll.toJSON() as never as RollJson;

		await sendChatMessage('damageResult', baseParams.actor, {
			result,
			damageTypes,
			powerId: toMashupId(baseParams.relatedPower),
			flavor: `${baseParams.relatedPower.name} ${baseParams.title} Critical Damage${tool ? ` using ${tool.name}` : ''}`,
		});
		resolve(null);
	}
};
