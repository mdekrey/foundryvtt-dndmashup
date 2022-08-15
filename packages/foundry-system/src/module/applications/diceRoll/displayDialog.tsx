import {
	DiceRoller,
	RollDetails,
	DiceRollerOptionalProps,
	DiceRollApplicationParametersBase,
	EquipmentDocument,
} from '@foundryvtt-dndmashup/mashup-react';
import { evaluateAndRoll } from '../../bonuses/evaluateAndRoll';
import { getToolsForPower } from './getToolsForPower';

export type DisplayDialogProps = DiceRollApplicationParametersBase & {
	tool?: EquipmentDocument<'weapon' | 'implement'>;
};

export function displayDialog<T extends string>(
	props: DisplayDialogProps,
	onComplete: (rollProps: RollDetails) => void,
	optionalProps: DiceRollerOptionalProps<T>
): JSX.Element;
export function displayDialog(props: DisplayDialogProps, onComplete: (rollProps: RollDetails) => void): JSX.Element;
export function displayDialog<T extends string = string>(
	{ baseDice, actor, power, source, rollType, tool, allowToolSelection }: DisplayDialogProps,
	onComplete: (rollProps: RollDetails) => void,
	optionalProps?: DiceRollerOptionalProps<T>
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
			{...(optionalProps as any)}
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
