import { applicationRegistry, RollJson, toMashupId } from '@foundryvtt-dndmashup/foundry-compat';
import { combineRollComponents, fromBonusesToFormula } from '@foundryvtt-dndmashup/mashup-rules';
import { DamageRollDetails } from '@foundryvtt-dndmashup/mashup-react';
import { sendChatMessage } from '../../chat/sendChatMessage';
import { roll } from './roll';
import { displayDamageDialog } from './damage-roll';
import { oxfordComma } from '@foundryvtt-dndmashup/core';

applicationRegistry.criticalDamage = async ({ ...baseParams }, resolve) => {
	return {
		content: displayDamageDialog(baseParams, onRoll),
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
			flavor: `${baseParams.source.name} ${baseParams.title} critical ${oxfordComma(damageTypes)} damage${
				tool ? ` using ${tool.name}` : ''
			}`.trim(),
		});
		resolve(null);
	}
};
