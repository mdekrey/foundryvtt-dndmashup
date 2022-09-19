import { applicationRegistry, RollJson } from '@foundryvtt-dndmashup/foundry-compat';
import { EquipmentDocument } from '@foundryvtt-dndmashup/mashup-react';
import { BonusByType, combineRollComponents, fromBonusesToFormula } from '@foundryvtt-dndmashup/mashup-rules';
import { isGame, toMashupId } from '../../../core/foundry';
import { sendChatMessage } from '../../chat/sendChatMessage';
import { displayDialog } from './displayDialog';
import { roll } from './roll';

applicationRegistry.healing = async (
	{ spendHealingSurge, healingSurge, isTemporary, runtimeBonusParameters, ...otherParams },
	resolve
) => {
	const targets = isGame(game) && game.user ? Array.from(game.user.targets) : [];
	const baseParams = {
		...otherParams,
		runtimeBonusParameters: {
			...runtimeBonusParameters,
			targets,
		},
	};

	return {
		content: displayDialog(baseParams, onRoll),
		title: `${baseParams.title} Healing`,
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

		await sendChatMessage('healingResult', baseParams.actor, {
			result,
			powerId: baseParams.runtimeBonusParameters.power
				? toMashupId(baseParams.runtimeBonusParameters.power)
				: undefined,
			toolId: tool ? toMashupId(tool) : undefined,
			flavor: `${baseParams.title} Healing${tool ? ` using ${tool.name}` : ''}`.trim(),
			spendHealingSurge,
			healingSurge,
			isTemporary,
		});
		resolve(null);
	}
};
