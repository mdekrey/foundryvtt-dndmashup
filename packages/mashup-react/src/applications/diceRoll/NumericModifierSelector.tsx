import { useEffect, useMemo, useState } from 'react';
import { FormInput } from '@foundryvtt-dndmashup/components';
import { EquipmentDocument, ItemDocument } from '../../module/item';
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
	bonusToText,
	FullFeatureBonus,
	FeatureBonusWithSource,
	ConditionRulesRuntimeParameters,
} from '@foundryvtt-dndmashup/mashup-rules';
import { ActorDocument } from '../../module/actor';
import { addContextToFeatureBonus } from '../../effects';
import { emptyConditionContext } from '../../bonusConditionRules';
import { useEvaluateBonusByType } from '../../components';

export function NumericModifierSelector({
	actor,
	tool,
	rollTarget,
	runtimeBonusParameters,
	extraBonuses,
	showApplied = false,
	onBonusesChange,
}: {
	tool: EquipmentDocument<'weapon' | 'implement'> | null;
	rollTarget: NumericBonusTarget;
	actor: ActorDocument;
	runtimeBonusParameters: ConditionRulesRuntimeParameters;
	extraBonuses?: readonly FullFeatureBonus[];
	showApplied?: boolean;
	onBonusesChange(bonusFormula: RollComponent, bonusByType: BonusByType): void;
}) {
	const evaluateBonusByType = useEvaluateBonusByType();
	const selectedBonusesState = lensFromState(useState<boolean[]>([]));
	const additionalModifiersState = lensFromState(useState(''));

	const toolBonuses = useMemo(() => {
		if (tool === null) return { indeterminate: [], applied: [] };
		const allToolBonuses = tool.allGrantedBonuses(true);
		const filtered = filterConditions<FullFeatureBonus>(
			allToolBonuses
				.filter((b) => b.target === rollTarget)
				.map((b): FeatureBonusWithSource => ({ ...b, source: tool }))
				.map(addContextToFeatureBonus({ actor, item: tool as ItemDocument, activeEffectSources: undefined })),
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
			extraBonuses.filter((b) => b.target === rollTarget),
			runtimeBonusParameters,
			true
		);
		const indeterminate = filtered.filter(([, result]) => result === ruleResultIndeterminate).map(([bonus]) => bonus);
		const applied = filtered.filter(([, result]) => result === true).map(([bonus]) => bonus);
		return { indeterminate, applied };
	}, [extraBonuses]);

	const actorLists = useMemo(() => {
		const applied = actor.derivedCache.bonuses.getApplied(rollTarget);
		const indeterminate = actor.derivedCache.bonuses.getIndeterminate(rollTarget);
		const filtered = filterConditions(indeterminate, runtimeBonusParameters, true);

		return {
			indeterminate: filtered.filter(([, result]) => result === ruleResultIndeterminate).map(([bonus]) => bonus),
			applied: [...applied, ...filtered.filter(([, result]) => result === true).map(([bonus]) => bonus)],
		};
	}, [actor.derivedCache]);
	const indeterminateBonuses = useMemo(
		() => [...actorLists.indeterminate, ...toolBonuses.indeterminate, ...extraBonusLists.indeterminate],
		[actorLists.indeterminate, toolBonuses.indeterminate, extraBonusLists.indeterminate]
	);

	const { bonusFormula, bonusByType, displayedBonuses } = useMemo(() => {
		const selectedIndeterminateBonuses = indeterminateBonuses.filter((_, index) => selectedBonusesState.value[index]);
		const displayedBonuses: FullFeatureBonus[] = [
			...actorLists.applied,
			...toolBonuses.applied,
			...extraBonusLists.applied,
		];
		const actualInput: FeatureBonusWithContext[] = [...displayedBonuses, ...selectedIndeterminateBonuses];
		if (additionalModifiersState.value.trim()) {
			actualInput.push({
				target: rollTarget,
				amount: additionalModifiersState.value.trim(),
				condition: null,
				context: { ...emptyConditionContext, actor },
			});
		}
		const bonusByType = evaluateBonusByType(actualInput);
		return {
			bonusFormula: fromBonusesToFormula(bonusByType),
			bonusByType,
			displayedBonuses,
		};
	}, [
		selectedBonusesState.value,
		indeterminateBonuses,
		actorLists.applied,
		toolBonuses.applied,
		extraBonusLists.applied,
		additionalModifiersState.value,
	]);

	useEffect(() => {
		onBonusesChange(bonusFormula, bonusByType);
	}, [bonusFormula, bonusByType]);

	return (
		<>
			{showApplied && displayedBonuses.length > 0 ? (
				<>
					<p>Applied:</p>
					<ul className="list-disc ml-4">
						{displayedBonuses.map((bonus) => {
							const text = `${bonusToText(bonus)} from ${bonus.source.name}`;
							return (
								<li
									className="pl-8 -indent-8 mb-2 even:bg-gradient-to-r from-transparent to-white odd:bg-transparent"
									key={text}>
									{text}
								</li>
							);
						})}
					</ul>
				</>
			) : null}
			{indeterminateBonuses.map((b, index) => (
				<FormInput.Inline key={index}>
					<FormInput.Checkbox
						{...Lens.fromProp<boolean[]>()(index).apply(selectedBonusesState)}
						className="self-center"
					/>
					<span>
						{typeof b.amount === 'number' ? ensureSign(b.amount) : b.amount}{' '}
						{b.amount < 0 ? 'penalty' : `${b.type ? `${b.type} ` : ''}bonus`.trim()}{' '}
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
