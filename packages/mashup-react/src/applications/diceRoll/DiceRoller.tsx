import { useMemo, useState } from 'react';
import { AppButton, FormInput } from '@foundryvtt-dndmashup/components';
import { DocumentSelector } from '../../components';
import { EquipmentDocument } from '../../module/item';
import { lensFromState, Lens } from '@foundryvtt-dndmashup/mashup-core';
import {
	BonusByType,
	NumericBonusTarget,
	FeatureBonusWithContext,
	filterBonuses,
	getRuleText,
	ruleResultIndeterminate,
	combineRollComponents,
	fromBonusesToFormula,
} from '../../bonuses';
import { ActorDocument } from '../../module/actor';

export type RollDetails = {
	baseDice: string;
	resultBonusesByType: BonusByType;
	tool?: EquipmentDocument<'weapon' | 'implement'>;
};

export type DiceRollerRequiredProps = {
	actor: ActorDocument;
	rollType: NumericBonusTarget;
	baseDice: string;
	possibleTools?: EquipmentDocument<'weapon' | 'implement'>[];
	runtimeBonusParameters: Partial<ConditionRulesRuntimeParameters>;

	evaluateBonuses(bonusesWithContext: FeatureBonusWithContext[]): BonusByType;
	onRoll(rollDetails: RollDetails): void;
};

export type DiceRollerOptionalProps<T extends string> = string extends T
	? {
			otherActions?: undefined;
			onOtherAction?: undefined;
	  }
	: {
			otherActions: Record<T, { content: string }>;
			onOtherAction(otherAction: T, rollDetails: RollDetails): void;
	  };

export type DiceRollerProps<T extends string> = DiceRollerRequiredProps & DiceRollerOptionalProps<T>;

export function DiceRoller<T extends string = string>({
	actor,
	baseDice,
	possibleTools,
	rollType,
	runtimeBonusParameters,
	evaluateBonuses,
	onRoll,
	otherActions,
	onOtherAction,
}: DiceRollerProps<T>) {
	const [tool, setTool] = useState<EquipmentDocument<'weapon' | 'implement'> | null>(
		(possibleTools && possibleTools[0]) || null
	);
	const selectedBonusesState = lensFromState(useState<boolean[]>([]));
	const additionalModifiersState = lensFromState(useState(''));

	const toolBonuses = useMemo(() => {
		if (tool === null) return { indeterminate: [], applied: [] };
		const allToolBonuses = tool.allGrantedBonuses(true);
		const filtered = filterBonuses(
			allToolBonuses
				.filter((b) => b.target === rollType)
				.map((bonus): FeatureBonusWithContext => ({ ...bonus, context: { actor: actor, item: tool } })),
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

	const { checkboxBonusFormula, bonusByType } = useMemo(() => {
		const selectedIndeterminateBonuses = indeterminateBonuses.filter((_, index) => selectedBonusesState.value[index]);
		const selectedBonuses = [
			...actor.appliedBonuses.filter((b) => b.target === rollType),
			...toolBonuses.applied,
			...selectedIndeterminateBonuses,
		];
		const bonusByType = evaluateBonuses(selectedBonuses);
		return { checkboxBonusFormula: fromBonusesToFormula(bonusByType), bonusByType };
	}, [selectedBonusesState.value, indeterminateBonuses, actor.appliedBonuses, toolBonuses.applied]);

	const currentRoll = combineRollComponents(
		combineRollComponents(baseDice, checkboxBonusFormula),
		additionalModifiersState.value
	);

	return (
		<div className="grid grid-cols-1 w-full gap-1">
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

			<div className="flex flex-row gap-1">
				<AppButton
					className="flex-1"
					onClick={() =>
						onRoll({
							baseDice: baseDice,
							resultBonusesByType: bonusByType,
							tool: tool ?? undefined,
						})
					}>
					Roll {currentRoll}
				</AppButton>
				{onOtherAction &&
					Object.keys(otherActions ?? {})
						.map((k) => k as T)
						.map((key) => (
							<AppButton
								className="flex-1"
								key={key}
								onClick={() =>
									onOtherAction(key, {
										baseDice: baseDice,
										resultBonusesByType: bonusByType,
										tool: tool ?? undefined,
									})
								}>
								{otherActions && otherActions[key].content}
							</AppButton>
						))}
			</div>
		</div>
	);
}
