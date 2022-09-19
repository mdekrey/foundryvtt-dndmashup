import { applicationRegistry } from '@foundryvtt-dndmashup/foundry-compat';
import { EquipmentDocument } from '@foundryvtt-dndmashup/mashup-react';
import { BonusByType, combineRollComponents, fromBonusesToFormula } from '@foundryvtt-dndmashup/mashup-rules';
import { isGame, toMashupId } from '../../../core/foundry';
import { sendChatMessage } from '../../chat/sendChatMessage';
import { displayDialog } from './displayDialog';
import { roll } from './roll';

applicationRegistry.attackRoll = async ({ defense, ...baseParams }, resolve) => {
	const targets = isGame(game) && game.user ? Array.from(game.user.targets) : [];

	// TODO: indeterminate effects from targets' defenses
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
			powerId: baseParams.runtimeBonusParameters.power
				? toMashupId(baseParams.runtimeBonusParameters.power)
				: undefined,
			toolId: tool ? toMashupId(tool) : undefined,
			flavor: `${baseParams.title} Attack vs. ${defense.toUpperCase()}${tool ? ` using ${tool.name}` : ''}`.trim(),
		});
		resolve(null);
	}
};
