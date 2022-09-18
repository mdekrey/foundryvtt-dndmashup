import { DamageRoller, DamageRollDetails } from '@foundryvtt-dndmashup/mashup-react';
import { evaluateAndRoll } from '../../bonuses/evaluateAndRoll';
import { getToolsForPower } from './getToolsForPower';
import { DisplayDialogProps } from './damage-roll';

export function displayDamageDialog(
	{
		baseDice,
		baseDamageTypes,
		actor,
		power,
		rollType,
		listType,
		tool,
		allowToolSelection,
		extraBonuses,
	}: DisplayDialogProps,
	onComplete: (rollProps: DamageRollDetails) => void,
	onCritical?: (rollProps: DamageRollDetails) => void
) {
	const possibleTools = !allowToolSelection
		? undefined
		: tool
		? [tool]
		: power
		? getToolsForPower(actor, power)
		: undefined;

	return (
		<DamageRoller
			actor={actor}
			rollType={rollType}
			listType={listType}
			baseDice={baseDice}
			extraBonuses={extraBonuses}
			baseDamageTypes={baseDamageTypes}
			onRoll={onComplete}
			runtimeBonusParameters={
				{
					/* TODO - parameters for passing to bonuses to determine if they apply or not */
				}
			}
			evaluateBonuses={evaluateAndRoll}
			possibleTools={possibleTools}
			onCriticalRoll={onCritical}
		/>
	);
}
