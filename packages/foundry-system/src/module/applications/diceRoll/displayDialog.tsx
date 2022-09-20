import {
	DiceRoller,
	RollDetails,
	DiceRollApplicationParametersBase,
	EquipmentDocument,
} from '@foundryvtt-dndmashup/mashup-react';
import { NumericBonusTarget } from '@foundryvtt-dndmashup/mashup-rules';
import { getToolsForPower } from './getToolsForPower';

export type DisplayDialogProps = DiceRollApplicationParametersBase & {
	tool?: EquipmentDocument<'weapon' | 'implement'>;
	runtimeTargetsRollType?: NumericBonusTarget;
};

export function displayDialog(
	{
		baseDice,
		actor,
		rollType,
		extraBonuses,
		tool,
		allowToolSelection,
		runtimeBonusParameters,
		runtimeTargetsRollType,
	}: DisplayDialogProps,
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
			runtimeTargetsRollType={runtimeTargetsRollType}
			baseDice={baseDice}
			onRoll={onComplete}
			runtimeBonusParameters={runtimeBonusParameters}
			extraBonuses={extraBonuses}
			possibleTools={possibleTools}
		/>
	);
}
