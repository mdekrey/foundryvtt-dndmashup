import { applicationRegistry, RollJson, toMashupId } from '@foundryvtt-dndmashup/foundry-compat';
import { BonusByType, combineRollComponents, fromBonusesToFormula } from '@foundryvtt-dndmashup/mashup-rules';
import { EquipmentDocument } from '@foundryvtt-dndmashup/mashup-react';
import { sendChatMessage } from '../../chat/sendChatMessage';
import { roll } from './roll';
import { displayDialog } from './displayDialog';

applicationRegistry.criticalDamage = async ({ damageTypes, ...baseParams }, resolve) => {
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
			powerId: baseParams.power ? toMashupId(baseParams.power) : undefined,
			flavor: `${baseParams.source.name} ${baseParams.title} Critical Damage${
				tool ? ` using ${tool.name}` : ''
			}`.trim(),
		});
		resolve(null);
	}
};
