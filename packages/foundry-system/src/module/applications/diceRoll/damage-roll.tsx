import { applicationRegistry, RollJson } from '@foundryvtt-dndmashup/foundry-compat';
import { combineRollComponents, fromBonusesToFormula } from '@foundryvtt-dndmashup/mashup-rules';
import {
	EquipmentDocument,
	DamageRollDetails,
	DamageRollApplicationParametersBase,
} from '@foundryvtt-dndmashup/mashup-react';
import { toMashupId } from '../../../core/foundry';
import { applicationDispatcher } from '../../../components/foundry/apps-provider';
import { sendChatMessage } from '../../chat/sendChatMessage';
import { roll } from './roll';
import { oxfordComma } from '@foundryvtt-dndmashup/core';
import { displayDamageDialog } from './displayDamageDialog';

export type DisplayDialogProps = DamageRollApplicationParametersBase & {
	tool?: EquipmentDocument<'weapon' | 'implement'>;
};

applicationRegistry.damage = async ({ allowCritical, ...baseParams }, resolve, reject) => {
	return {
		content: displayDamageDialog(baseParams, onRoll, allowCritical ? onCritical : undefined),
		title: `${baseParams.title} Damage`,
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
			flavor: `${baseParams.title} ${oxfordComma(damageTypes)} damage${tool ? ` using ${tool.name}` : ''}`.trim(),
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
