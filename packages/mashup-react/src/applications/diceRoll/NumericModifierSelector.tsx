import { useEffect, useMemo, useState } from 'react';
import { FormInput } from '@foundryvtt-dndmashup/components';
import { EquipmentDocument } from '../../module/item';
import { lensFromState, Lens, ensureSign } from '@foundryvtt-dndmashup/core';
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
	extraBonuses,
	evaluateBonuses,
	onBonusesChange,
}: {
	tool: EquipmentDocument<'weapon' | 'implement'> | null;
	rollTarget: NumericBonusTarget;
	actor: ActorDocument;
	runtimeBonusParameters: Partial<ConditionRulesRuntimeParameters>;
	extraBonuses?: FeatureBonusWithContext[];
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

	const extraBonusLists = useMemo(() => {
		if (!extraBonuses) return { indeterminate: [], applied: [] };
		const filtered = filterConditions(
			extraBonuses
				.filter((b) => b.target === rollTarget)
				.map((bonus): FeatureBonusWithContext => ({ ...bonus, context: { actor: actor } })),
			runtimeBonusParameters,
			true
		);
		const indeterminate = filtered.filter(([, result]) => result === ruleResultIndeterminate).map(([bonus]) => bonus);
		const applied = filtered.filter(([, result]) => result === true).map(([bonus]) => bonus);
		return { indeterminate, applied };
	}, [extraBonuses]);

	const applied = actor.derivedCache.bonuses.getApplied(rollTarget);
	const indeterminate = actor.derivedCache.bonuses.getIndeterminate(rollTarget);
	const indeterminateBonuses = useMemo(
		() => [...indeterminate, ...toolBonuses.indeterminate, ...extraBonusLists.indeterminate],
		[indeterminate, toolBonuses.indeterminate, extraBonusLists.indeterminate]
	);

	const { bonusFormula, bonusByType } = useMemo(() => {
		const selectedIndeterminateBonuses = indeterminateBonuses.filter((_, index) => selectedBonusesState.value[index]);
		const selectedBonuses: FeatureBonusWithContext[] = [
			...applied,
			...toolBonuses.applied,
			...extraBonusLists.applied,
			...selectedIndeterminateBonuses,
		];
		if (additionalModifiersState.value.trim()) {
			selectedBonuses.push({
				target: rollTarget,
				amount: additionalModifiersState.value.trim(),
				condition: null,
				context: { actor },
			});
		}
		const bonusByType = evaluateBonuses(selectedBonuses);
		return {
			bonusFormula: fromBonusesToFormula(bonusByType),
			bonusByType,
		};
	}, [
		selectedBonusesState.value,
		indeterminateBonuses,
		applied,
		toolBonuses.applied,
		extraBonusLists.applied,
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
						{typeof b.amount === 'number' ? ensureSign(b.amount) : b.amount}{' '}
						{b.amount < 0 ? 'penalty' : `${b.type ? `${b.type} ` : ''}bonus`.trim()} if{' '}
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
