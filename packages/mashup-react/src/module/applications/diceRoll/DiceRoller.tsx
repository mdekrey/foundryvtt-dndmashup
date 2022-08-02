import { useMemo, useState } from 'react';
import { AppButton, FormInput } from '@foundryvtt-dndmashup/components';
import { DocumentSelector } from '../../../components';
import { EquipmentDocument } from '../../item';
import { immerMutatorToMutator, Lens, Stateful } from '@foundryvtt-dndmashup/mashup-core';
import {
	BonusByType,
	BonusTarget,
	FeatureBonusWithContext,
	filterBonuses,
	getRuleText,
	ruleResultIndeterminate,
} from '../../bonuses';
import { ActorDocument } from '../../actor';
import { cloneDeep } from 'lodash/fp';

export type RollDetails = {
	dice: string;
	tool?: EquipmentDocument<'weapon' | 'implement'>;
};

export type DiceRollerProps = {
	actor: ActorDocument;
	rollType: BonusTarget;
	baseDice: string;
	possibleTools?: EquipmentDocument<'weapon' | 'implement'>[];
	runtimeBonusParameters: Partial<ConditionRulesRuntimeParameters>;

	evaluateBonuses(bonusesWithContext: FeatureBonusWithContext[]): BonusByType;
	onRoll(rollDetails: RollDetails): void;
};

function lensFromState<S>([value, setValue]: [S, React.Dispatch<React.SetStateAction<S>>]): Stateful<S> {
	return {
		value,
		onChangeValue: (mutator) => {
			return setValue((p) => {
				const cloned = cloneDeep(p);
				immerMutatorToMutator(mutator)(cloned);
				return cloned;
			});
		},
	};
}

const showBonusType = false;

export function DiceRoller({
	actor,
	baseDice,
	possibleTools,
	rollType,
	runtimeBonusParameters,
	evaluateBonuses,
	onRoll,
}: DiceRollerProps) {
	const [tool, setTool] = useState<EquipmentDocument<'weapon' | 'implement'> | null>(
		(possibleTools && possibleTools[0]) || null
	);
	const selectedBonusesState = lensFromState(useState<boolean[]>([]));
	const additionalModifiersState = lensFromState(useState(''));

	const toolBonuses = useMemo(() => {
		if (tool === null) return { indeterminate: [], applied: [] };
		const allToolBonuses = tool.allGrantedBonuses(true);
		const filtered = filterBonuses(
			allToolBonuses.map((bonus): FeatureBonusWithContext => ({ ...bonus, context: { actor: actor, item: tool } })),
			runtimeBonusParameters,
			true
		);
		const indeterminate = filtered.filter(([, result]) => result === ruleResultIndeterminate).map(([bonus]) => bonus);
		const applied = filtered.filter(([, result]) => result === true).map(([bonus]) => bonus);
		return { indeterminate, applied };
	}, [tool]);

	const indeterminateBonuses = useMemo(
		() => [...actor.indeterminateBonuses.filter((b) => b.target === rollType), ...toolBonuses.indeterminate],
		[actor.indeterminateBonuses, toolBonuses.indeterminate]
	);

	const checkboxBonusFormula = useMemo(() => {
		const selectedIndeterminateBonuses = indeterminateBonuses.filter((_, index) => selectedBonusesState.value[index]);
		const selectedBonuses = [
			...actor.appliedBonuses.filter((b) => b.target === rollType),
			...toolBonuses.applied,
			...selectedIndeterminateBonuses,
		];
		const result = evaluateBonuses(selectedBonuses);

		const formula = (
			showBonusType
				? Object.keys(result)
						.filter((k) => result[k])
						.map((k) => `${result[k] < 0 ? ' - ' : ' + '}${Math.abs(result[k])}${k ? `[${k}]` : ''}`)
				: Object.keys(result)
						.reduce((a, k) => [a[0] + result[k]], [0])
						.map((v) => (v === 0 ? '' : `${v > 0 ? ' + ' : ' - '}${Math.abs(v)}`))
		).join('');

		return formula;
	}, [selectedBonusesState.value, indeterminateBonuses, actor.appliedBonuses, toolBonuses.applied]);

	const currentRoll = `${baseDice}${
		additionalModifiersState.value ? ` + ${additionalModifiersState.value.trim().replace(/^\++/g, '').trim()}` : ''
	}${checkboxBonusFormula}`;

	return (
		<div className="grid grid-cols-1 w-full gap-1 mt-1 pt-1">
			<p className="bg-theme text-white px-2 font-bold text-center py-1">{baseDice}</p>
			{possibleTools ? (
				<div className="text-lg">
					<DocumentSelector documents={possibleTools} value={tool} onChange={setTool} allowNull={true} />
				</div>
			) : null}
			{indeterminateBonuses.map((b, index) => (
				<FormInput.Inline key={index}>
					<FormInput.Checkbox
						{...Lens.fromProp<boolean[]>()(index).apply(selectedBonusesState)}
						className="self-center"
					/>
					<span>
						{b.amount} {b.amount < 0 ? 'penalty' : `${b.type ? `${b.type} ` : ''}bonus`.trim()} if{' '}
						{b.condition ? getRuleText(b.condition) : '...?'}
					</span>
				</FormInput.Inline>
			))}
			<FormInput className="text-lg">
				<FormInput.TextField {...additionalModifiersState} />
				<FormInput.Label>Other Modifiers</FormInput.Label>
			</FormInput>

			<AppButton
				onClick={() =>
					onRoll({
						dice: currentRoll,
						tool: tool ?? undefined,
					})
				}>
				Roll {currentRoll}
			</AppButton>
		</div>
	);
}
