import { useEffect, useMemo, useState } from 'react';
import { FormInput } from '@foundryvtt-dndmashup/components';
import { EquipmentDocument } from '../../module/item';
import { lensFromState, Lens } from '@foundryvtt-dndmashup/core';
import {
	filterConditions,
	getRuleText,
	ruleResultIndeterminate,
	DynamicListTarget,
	DynamicListEntryWithContext,
} from '@foundryvtt-dndmashup/mashup-rules';
import { ActorDocument } from '../../module/actor';

export function DynamicListSelector({
	actor,
	tool,
	listType,
	runtimeBonusParameters,
	onListChange,
}: {
	tool: EquipmentDocument<'weapon' | 'implement'> | null;
	listType: DynamicListTarget;
	actor: ActorDocument;
	runtimeBonusParameters: Partial<ConditionRulesRuntimeParameters>;
	onListChange(dynamicListEntries: string[]): void;
}) {
	const selectedDynamicListState = lensFromState(useState<boolean[]>([]));

	const toolDynamicList = useMemo(() => {
		if (tool === null) return { indeterminate: [], applied: [] };
		const allToolDynamicList = tool.allDynamicList(true);
		const filtered = filterConditions(
			allToolDynamicList
				.filter((b) => b.target === listType)
				.map((entry): DynamicListEntryWithContext => ({ ...entry, context: { actor: actor, item: tool } })),
			runtimeBonusParameters,
			true
		);
		const indeterminate = filtered.filter(([, result]) => result === ruleResultIndeterminate).map(([bonus]) => bonus);
		const applied = filtered.filter(([, result]) => result === true).map(([bonus]) => bonus);
		return { indeterminate, applied };
	}, [tool]);

	const indeterminateDynamicList = useMemo(
		() => [...actor.indeterminateDynamicList.filter((b) => b.target === listType), ...toolDynamicList.indeterminate],
		[actor.indeterminateDynamicList, toolDynamicList.indeterminate]
	);

	const currentDynamicList = useMemo(() => {
		const selectedIndeterminateDynamicList = indeterminateDynamicList.filter(
			(_, index) => selectedDynamicListState.value[index]
		);
		const selectedDynamicList: DynamicListEntryWithContext[] = [
			...actor.appliedDynamicList.filter((b) => b.target === listType),
			...toolDynamicList.applied,
			...selectedIndeterminateDynamicList,
		];
		return selectedDynamicList.map((e) => e.entry);
	}, [selectedDynamicListState.value, indeterminateDynamicList, actor.appliedDynamicList, toolDynamicList.applied]);

	useEffect(() => {
		onListChange(currentDynamicList);
	}, [currentDynamicList]);

	return (
		<>
			{indeterminateDynamicList.map((e, index) => (
				<FormInput.Inline key={index}>
					<FormInput.Checkbox
						{...Lens.fromProp<boolean[]>()(index).apply(selectedDynamicListState)}
						className="self-center"
					/>
					<span>
						{e.entry} {e.condition ? getRuleText(e.condition) : '...?'}
					</span>
				</FormInput.Inline>
			))}
		</>
	);
}
