import { useMemo, useState } from 'react';
import { AppButton, FormInput } from '@foundryvtt-dndmashup/components';
import { DocumentSelector } from '../../../components';
import { EquipmentDocument } from '../../item';
import { immerMutatorToMutator, Stateful } from '@foundryvtt-dndmashup/mashup-core';
import { BonusTarget } from '../../bonuses';
import { ActorDocument } from '../../actor';

export type RollDetails = {
	dice: string;
	tool?: EquipmentDocument<'weapon' | 'implement'>;
};

export type DiceRollerProps = {
	actor: ActorDocument;
	rollType: BonusTarget;
	baseDice: string;
	possibleTools?: EquipmentDocument<'weapon' | 'implement'>[];
	onRoll(rollDetails: RollDetails): void;
};

function lensFromState<S>([value, setValue]: [S, React.Dispatch<React.SetStateAction<S>>]): Stateful<S> {
	return {
		value,
		onChangeValue: (mutator) => setValue(immerMutatorToMutator(mutator)),
	};
}

export function DiceRoller({ actor, baseDice, possibleTools, rollType, onRoll }: DiceRollerProps) {
	const [tool, setTool] = useState<EquipmentDocument<'weapon' | 'implement'> | null>(
		(possibleTools && possibleTools[0]) || null
	);
	const additionalModifiersState = lensFromState(useState(''));

	const currentRoll = `${baseDice}${
		additionalModifiersState.value ? ` + ${additionalModifiersState.value.trim().replace(/^\++/g, '').trim()}` : ''
	}`;

	const bonuses = useMemo(() => actor.allBonuses.filter((b) => b.target === rollType), [actor.allBonuses]);

	return (
		<div className="grid grid-cols-1 w-full gap-1 mt-1 pt-1">
			<p className="bg-theme text-white px-2 font-bold text-center py-1">{baseDice}</p>
			<div className="text-lg">
				{possibleTools ? (
					<DocumentSelector documents={possibleTools} value={tool} onChangeValue={() => setTool} />
				) : null}
			</div>
			{bonuses.map((b, index) => (
				<FormInput.Inline key={index}>
					<FormInput.Checkbox defaultChecked={false} className="self-center" />
					<span>
						{b.amount} {b.amount < 0 ? 'penalty' : `${b.type} bonus`.trim()} if...?
					</span>
				</FormInput.Inline>
			))}
			<FormInput className="text-lg">
				<FormInput.TextField {...additionalModifiersState} />
				<FormInput.Label>Other Modifiers</FormInput.Label>
			</FormInput>
			<hr className="border-black" />

			<p>
				<span className="font-bold">Final roll:</span> {currentRoll}
			</p>
			<AppButton
				onClick={() =>
					onRoll({
						dice: currentRoll,
						tool: tool ?? undefined,
					})
				}>
				Roll
			</AppButton>
		</div>
	);
}
