import { applicationRegistry, RollJson, toMashupId } from '@foundryvtt-dndmashup/foundry-compat';
import { BonusByType, combineRollComponents, fromBonusesToFormula } from '@foundryvtt-dndmashup/mashup-rules';
import { EquipmentDocument } from '@foundryvtt-dndmashup/mashup-react';
import { applicationDispatcher } from '../../../components/foundry/apps-provider';
import { sendChatMessage } from '../../chat/sendChatMessage';
import { roll } from './roll';
import { displayDialog } from './displayDialog';

applicationRegistry.damage = async ({ damageTypes, allowCritical, ...baseParams }, resolve, reject) => {
	return {
		content: allowCritical
			? displayDialog(baseParams, onRoll, {
					otherActions: { critical: { content: 'Critical!' } },
					onOtherAction: onCritical,
			  })
			: displayDialog(baseParams, onRoll),
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
			powerId: baseParams.power ? toMashupId(baseParams.power) : undefined,
			flavor: `${baseParams.source.name} ${baseParams.title} Damage${tool ? ` using ${tool.name}` : ''}`.trim(),
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
