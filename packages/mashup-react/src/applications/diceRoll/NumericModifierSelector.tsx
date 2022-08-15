import { useEffect, useMemo, useState } from 'react';
import { FormInput } from '@foundryvtt-dndmashup/components';
import { EquipmentDocument } from '../../module/item';
import { lensFromState, Lens } from '@foundryvtt-dndmashup/core';
import {
	BonusByType,
	NumericBonusTarget,
	FeatureBonusWithContext,
	filterConditions,
	getRuleText,
	ruleResultIndeterminate,
	fromBonusesToFormula,
	RollComponent,
} from '@foundryvtt-dndmashup/mashup-rules';
import { ActorDocument } from '../../module/actor';

export function NumericModifierSelector({
	actor,
	tool,
	rollTarget,
	runtimeBonusParameters,
	evaluateBonuses,
	onBonusesChange,
}: {
	tool: EquipmentDocument<'weapon' | 'implement'> | null;
	rollTarget: NumericBonusTarget;
	actor: ActorDocument;
	runtimeBonusParameters: Partial<ConditionRulesRuntimeParameters>;
	evaluateBonuses(bonusesWithContext: FeatureBonusWithContext[]): BonusByType;
	onBonusesChange(bonusFormula: RollComponent, bonusByType: BonusByType): void;
}) {
	const selectedBonusesState = lensFromState(useState<boolean[]>([]));
	const additionalModifiersState = lensFromState(useState(''));

	const toolBonuses = useMemo(() => {
		if (tool === null) return { indeterminate: [], applied: [] };
		const allToolBonuses = tool.allGrantedBonuses(true);
		const filtered = filterConditions(
			allToolBonuses
				.filter((b) => b.target === rollTarget)
				.map((bonus): FeatureBonusWithContext => ({ ...bonus, context: { actor: actor, item: tool } })),
			runtimeBonusParameters,
			true
		);
		const indeterminate = filtered.filter(([, result]) => result === ruleResultIndeterminate).map(([bonus]) => bonus);
		const applied = filtered.filter(([, result]) => result === true).map(([bonus]) => bonus);
		return { indeterminate, applied };
	}, [tool]);

	const indeterminateBonuses = useMemo(
		() => [...actor.indeterminateBonuses.filter((b) => b.target === rollTarget), ...toolBonuses.indeterminate],
		[actor.indeterminateBonuses, toolBonuses.indeterminate]
	);

	const { bonusFormula, bonusByType } = useMemo(() => {
		const selectedIndeterminateBonuses = indeterminateBonuses.filter((_, index) => selectedBonusesState.value[index]);
		const selectedBonuses: FeatureBonusWithContext[] = [
			...actor.appliedBonuses.filter((b) => b.target === rollTarget),
			...toolBonuses.applied,
			...selectedIndeterminateBonuses,
		];
		if (additionalModifiersState.value.trim()) {
			console.log('include', additionalModifiersState.value);
			selectedBonuses.push({
				target: rollTarget,
				amount: additionalModifiersState.value.trim(),
				condition: null,
				context: { actor },
			});
		}
		const bonusByType = evaluateBonuses(selectedBonuses);
		console.log({ bonusByType, selectedBonuses });
		return {
			bonusFormula: fromBonusesToFormula(bonusByType),
			bonusByType,
		};
	}, [
		selectedBonusesState.value,
		indeterminateBonuses,
		actor.appliedBonuses,
		toolBonuses.applied,
		additionalModifiersState.value,
	]);

	useEffect(() => {
		onBonusesChange(bonusFormula, bonusByType);
	}, [bonusFormula, bonusByType]);

	return (
		<>
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
		</>
	);
}
