import { useState } from 'react';
import { AppButton, BlockHeader } from '@foundryvtt-dndmashup/components';
import {
	BonusByType,
	NumericBonusTarget,
	FeatureBonusWithContext,
	combineRollComponents,
	RollComponent,
} from '@foundryvtt-dndmashup/mashup-rules';
import { ActorDocument } from '../../module/actor';
import { EquipmentDocument } from '../../module/item';
import { NumericModifierSelector } from './NumericModifierSelector';
import { ToolSelector } from './ToolSelector';

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
	extraBonuses?: FeatureBonusWithContext[];

	evaluateBonuses(bonusesWithContext: FeatureBonusWithContext[]): BonusByType;
	onRoll(rollDetails: RollDetails): void;
};

export type DiceRollerProps = DiceRollerRequiredProps;

export function DiceRoller({
	actor,
	baseDice,
	possibleTools,
	rollType,
	runtimeBonusParameters,
	extraBonuses,
	evaluateBonuses,
	onRoll,
}: DiceRollerProps) {
	const [tool, setTool] = useState<EquipmentDocument<'weapon' | 'implement'> | null>(
		(possibleTools && possibleTools[0]) ?? null
	);
	const [{ bonusFormula, bonusByType }, setBonusInfo] = useState<{
		bonusFormula: RollComponent;
		bonusByType: BonusByType;
	}>({ bonusFormula: '', bonusByType: {} });

	const currentRoll = combineRollComponents(baseDice, bonusFormula);

	return (
		<div className="grid grid-cols-1 w-full gap-1">
			<BlockHeader>{baseDice}</BlockHeader>
			<ToolSelector possibleTools={possibleTools} tool={tool} onChangeTool={setTool} />
			<NumericModifierSelector
				actor={actor}
				tool={tool}
				evaluateBonuses={evaluateBonuses}
				extraBonuses={extraBonuses}
				onBonusesChange={(bonusFormula, bonusByType) => setBonusInfo({ bonusFormula, bonusByType })}
				rollTarget={rollType}
				runtimeBonusParameters={runtimeBonusParameters}
			/>

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
			</div>
		</div>
	);
}
