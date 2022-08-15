import { useMemo, useState } from 'react';
import { oxfordComma } from '@foundryvtt-dndmashup/core';
import { AppButton, BlockHeader } from '@foundryvtt-dndmashup/components';
import {
	BonusByType,
	NumericBonusTarget,
	FeatureBonusWithContext,
	combineRollComponents,
	RollComponent,
	DamageType,
	DynamicListTarget,
} from '@foundryvtt-dndmashup/mashup-rules';
import { ActorDocument } from '../../module/actor';
import { EquipmentDocument } from '../../module/item';
import { NumericModifierSelector } from './NumericModifierSelector';
import { ToolSelector } from './ToolSelector';
import { DynamicListSelector } from './DynamicListSelector';

export type DamageRollDetails = {
	baseDice: string;
	resultBonusesByType: BonusByType;
	damageTypes: DamageType[];
	tool?: EquipmentDocument<'weapon' | 'implement'>;
};

export type DamageRollerRequiredProps = {
	actor: ActorDocument;
	rollType: NumericBonusTarget;
	listType: DynamicListTarget;
	baseDice: string;
	baseDamageTypes: DamageType[];
	possibleTools?: EquipmentDocument<'weapon' | 'implement'>[];
	runtimeBonusParameters: Partial<ConditionRulesRuntimeParameters>;

	evaluateBonuses(bonusesWithContext: FeatureBonusWithContext[]): BonusByType;
	onRoll(rollDetails: DamageRollDetails): void;
	onCriticalRoll?(rollDetails: DamageRollDetails): void;
};

export function DamageRoller({
	actor,
	baseDice,
	baseDamageTypes,
	possibleTools,
	rollType,
	listType,
	runtimeBonusParameters,
	evaluateBonuses,
	onRoll,
	onCriticalRoll,
}: DamageRollerRequiredProps) {
	const [tool, setTool] = useState<EquipmentDocument<'weapon' | 'implement'> | null>(
		(possibleTools && possibleTools[0]) ?? null
	);
	const [{ bonusFormula, bonusByType }, setBonusInfo] = useState<{
		bonusFormula: RollComponent;
		bonusByType: BonusByType;
	}>({ bonusFormula: '', bonusByType: {} });
	const [damageTypes, setDamageTypes] = useState<DamageType[]>([]);

	const currentRoll = combineRollComponents(baseDice, bonusFormula);
	const currentDamageTypes = useMemo(() => [...damageTypes, ...baseDamageTypes].sort(), [damageTypes, baseDamageTypes]);

	return (
		<div className="grid grid-cols-1 w-full gap-1">
			<BlockHeader>
				{baseDice} {oxfordComma(baseDamageTypes)} damage
			</BlockHeader>
			<ToolSelector possibleTools={possibleTools} tool={tool} onChangeTool={setTool} />
			<NumericModifierSelector
				actor={actor}
				tool={tool}
				evaluateBonuses={evaluateBonuses}
				onBonusesChange={(bonusFormula, bonusByType) => setBonusInfo({ bonusFormula, bonusByType })}
				rollTarget={rollType}
				runtimeBonusParameters={runtimeBonusParameters}
			/>
			<DynamicListSelector
				actor={actor}
				tool={tool}
				onListChange={(dt) => setDamageTypes(dt as DamageType[])}
				listType={listType}
				runtimeBonusParameters={runtimeBonusParameters}
			/>

			<div className="flex flex-row gap-1">
				<AppButton
					className="flex-1"
					onClick={() =>
						onRoll({
							baseDice: baseDice,
							damageTypes: currentDamageTypes,
							resultBonusesByType: bonusByType,
							tool: tool ?? undefined,
						})
					}>
					Roll {currentRoll} {oxfordComma(currentDamageTypes)} damage
				</AppButton>
				{onCriticalRoll ? (
					<AppButton
						className="flex-1"
						onClick={() =>
							onCriticalRoll({
								baseDice: baseDice,
								damageTypes: currentDamageTypes,
								resultBonusesByType: bonusByType,
								tool: tool ?? undefined,
							})
						}>
						Critical!
					</AppButton>
				) : null}
			</div>
		</div>
	);
}
