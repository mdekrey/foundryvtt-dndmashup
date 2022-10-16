import { DamageRoller, DamageRollDetails } from '@foundryvtt-dndmashup/mashup-react';
import { getToolsForPower } from './getToolsForPower';
import { DisplayDialogProps } from './damage-roll';

export function displayDamageDialog(
	{
		baseDice,
		baseDamageTypes,
		actor,
		rollType,
		listType,
		tool,
		allowToolSelection,
		extraBonuses,
		runtimeBonusParameters,
	}: DisplayDialogProps,
	onComplete: (rollProps: DamageRollDetails) => void,
	onCritical?: (rollProps: DamageRollDetails) => void
) {
	const possibleTools = !allowToolSelection
		? undefined
		: tool
		? [tool]
		: runtimeBonusParameters.power && actor
		? getToolsForPower(actor, runtimeBonusParameters.power)
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
			runtimeBonusParameters={runtimeBonusParameters}
			possibleTools={possibleTools}
			onCriticalRoll={onCritical}
		/>
	);
}
