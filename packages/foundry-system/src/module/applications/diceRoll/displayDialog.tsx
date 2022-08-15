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
	{ baseDice, actor, power, source, rollType, tool, allowToolSelection }: DisplayDialogProps,
	onComplete: (rollProps: RollDetails) => void
) {
	const possibleTools = !allowToolSelection
		? undefined
		: tool
		? [tool]
		: power
		? getToolsForPower(actor, power)
		: undefined;

	return (
		<DiceRoller
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
			possibleTools={possibleTools}
		/>
	);
}
