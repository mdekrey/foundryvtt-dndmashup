import { DocumentSelector } from '../../../components';
import { useState } from 'react';
import { EquipmentDocument } from '../../item';

export type RollDetails = {
	dice: string;
	tool?: EquipmentDocument<'weapon' | 'implement'>;
};

export type DiceRollerProps = {
	baseDice: string;
	possibleTools?: EquipmentDocument<'weapon' | 'implement'>[];
	onRoll(rollDetails: RollDetails): void;
};

export function DiceRoller({ baseDice, possibleTools, onRoll }: DiceRollerProps) {
	const [tool, setTool] = useState<EquipmentDocument<'weapon' | 'implement'> | null>(
		(possibleTools && possibleTools[0]) || null
	);

	return (
		<>
			<p>{baseDice}</p>
			{possibleTools ? <DocumentSelector documents={possibleTools} value={tool} onChangeValue={() => setTool} /> : null}
			<button onClick={() => onRoll({ dice: baseDice, tool: tool ?? undefined })}>Roll</button>
		</>
	);
}
