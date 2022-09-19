import {
	DiceRoller,
	RollDetails,
	DiceRollApplicationParametersBase,
	EquipmentDocument,
} from '@foundryvtt-dndmashup/mashup-react';
import { evaluateAndRoll } from '../../bonuses/evaluateAndRoll';
import { getToolsForPower } from './getToolsForPower';

export type DisplayDialogProps = DiceRollApplicationParametersBase & {
	tool?: EquipmentDocument<'weapon' | 'implement'>;
};

export function displayDialog(
	{ baseDice, actor, rollType, extraBonuses, tool, allowToolSelection, runtimeBonusParameters }: DisplayDialogProps,
	onComplete: (rollProps: RollDetails) => void
) {
	const possibleTools = !allowToolSelection
		? undefined
		: tool
		? [tool]
		: runtimeBonusParameters.power
		? getToolsForPower(actor, runtimeBonusParameters.power)
		: undefined;

	return (
		<DiceRoller
			actor={actor}
			rollType={rollType}
			baseDice={baseDice}
			onRoll={onComplete}
			runtimeBonusParameters={runtimeBonusParameters}
			extraBonuses={extraBonuses}
			evaluateBonuses={(bonuses) => evaluateAndRoll(bonuses)}
			possibleTools={possibleTools}
		/>
	);
}
