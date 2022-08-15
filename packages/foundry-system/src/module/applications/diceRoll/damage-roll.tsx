import { applicationRegistry, RollJson, toMashupId } from '@foundryvtt-dndmashup/foundry-compat';
import { combineRollComponents, fromBonusesToFormula } from '@foundryvtt-dndmashup/mashup-rules';
import {
	EquipmentDocument,
	DamageRoller,
	DamageRollDetails,
	DamageRollApplicationParametersBase,
} from '@foundryvtt-dndmashup/mashup-react';
import { applicationDispatcher } from '../../../components/foundry/apps-provider';
import { sendChatMessage } from '../../chat/sendChatMessage';
import { evaluateAndRoll } from '../../bonuses/evaluateAndRoll';
import { getToolsForPower } from './getToolsForPower';
import { roll } from './roll';
import { oxfordComma } from '@foundryvtt-dndmashup/core';

type DisplayDialogProps = DamageRollApplicationParametersBase & {
	tool?: EquipmentDocument<'weapon' | 'implement'>;
};

export function displayDamageDialog(
	{ baseDice, baseDamageTypes, actor, power, source, rollType, listType, tool, allowToolSelection }: DisplayDialogProps,
	onComplete: (rollProps: DamageRollDetails) => void,
	onCritical?: (rollProps: DamageRollDetails) => void
) {
	const possibleTools = !allowToolSelection
		? undefined
		: tool
		? [tool]
		: power
		? getToolsForPower(actor, power)
		: undefined;

	return (
		<DamageRoller
			actor={actor}
			rollType={rollType}
			listType={listType}
			baseDice={baseDice}
			baseDamageTypes={baseDamageTypes}
			onRoll={onComplete}
			runtimeBonusParameters={
				{
					/* TODO - parameters for passing to bonuses to determine if they apply or not */
				}
			}
			evaluateBonuses={evaluateAndRoll}
			possibleTools={possibleTools}
			onCriticalRoll={onCritical}
		/>
	);
}

applicationRegistry.damage = async ({ allowCritical, ...baseParams }, resolve, reject) => {
	return {
		content: displayDamageDialog(baseParams, onRoll, allowCritical ? onCritical : undefined),
		title: `${baseParams.title} Critical Damage`,
		options: { resizable: true },
	};

	async function onRoll({ baseDice, damageTypes, resultBonusesByType, tool }: DamageRollDetails) {
		const dice = `${combineRollComponents(baseDice, fromBonusesToFormula(resultBonusesByType))}`;

		const resultRoll = await roll(dice, { actor: baseParams.actor, item: tool });

		const result = resultRoll.toJSON() as never as RollJson;

		await sendChatMessage('damageResult', baseParams.actor, {
			result,
			damageTypes,
			powerId: baseParams.power ? toMashupId(baseParams.power) : undefined,
			flavor: `${baseParams.source.name} ${baseParams.title} ${oxfordComma(damageTypes)} damage${
				tool ? ` using ${tool.name}` : ''
			}`.trim(),
		});
		resolve(null);
	}

	async function onCritical({ baseDice, damageTypes, resultBonusesByType, tool }: DamageRollDetails) {
		const dice = `${combineRollComponents(baseDice, fromBonusesToFormula(resultBonusesByType))}`;

		const resultRoll = await roll(dice, { actor: baseParams.actor, item: tool }, undefined, { maximize: true });

		const { result } = await applicationDispatcher.launchApplication('criticalDamage', {
			...baseParams,
			baseDice: `${resultRoll.total}`,
			rollType: 'critical-damage',
			listType: 'criticalDamageTypes',
			baseDamageTypes: damageTypes,
			tool,
		});
		result.then(resolve, reject);
	}
};
