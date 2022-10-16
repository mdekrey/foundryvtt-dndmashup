import { applicationRegistry } from '@foundryvtt-dndmashup/foundry-compat';
import { EquipmentDocument } from '@foundryvtt-dndmashup/mashup-react';
import { BonusByType, combineRollComponents, fromBonusesToFormula } from '@foundryvtt-dndmashup/mashup-rules';
import { displayDialog } from './displayDialog';
import { roll } from './roll';

applicationRegistry.diceRoll = async ({ sendToChat, flavor, ...baseParams }, resolve) => {
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
			await roll(
				dice,
				{ actor: baseParams.actor ?? undefined, item: tool },
				(sendToChat ? baseParams.actor : undefined) ?? undefined,
				undefined,
				flavor
			)
		).total;
		if (result !== undefined) resolve(result);
	}
};
