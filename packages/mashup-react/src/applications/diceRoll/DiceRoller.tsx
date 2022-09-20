import { useState } from 'react';
import { AppButton, BlockHeader, Tabs } from '@foundryvtt-dndmashup/components';
import {
	BonusByType,
	NumericBonusTarget,
	combineRollComponents,
	RollComponent,
	FullFeatureBonus,
	ConditionRulesRuntimeParameters,
} from '@foundryvtt-dndmashup/mashup-rules';
import { ActorDocument, TokenDocument } from '../../module/actor';
import { EquipmentDocument } from '../../module/item';
import { NumericModifierSelector } from './NumericModifierSelector';
import { ToolSelector } from './ToolSelector';
import { useControlTokenOnClick, useHoverToken } from '../../components';

export type RollDetails = {
	baseDice: string;
	resultBonusesByType: BonusByType;
	tool?: EquipmentDocument<'weapon' | 'implement'>;
	targetBonuses: Record<string, BonusByType>;
};

export type DiceRollerRequiredProps = {
	actor: ActorDocument;
	rollType: NumericBonusTarget;
	runtimeTargetsRollType?: NumericBonusTarget;
	baseDice: string;
	possibleTools?: EquipmentDocument<'weapon' | 'implement'>[];
	runtimeBonusParameters: ConditionRulesRuntimeParameters;
	extraBonuses?: FullFeatureBonus[];

	onRoll(rollDetails: RollDetails): void;
};

export type DiceRollerProps = DiceRollerRequiredProps;

export function DiceRoller({
	actor,
	baseDice,
	possibleTools,
	rollType,
	runtimeBonusParameters,
	runtimeTargetsRollType,
	extraBonuses,
	onRoll,
}: DiceRollerProps) {
	const [tool, setTool] = useState<EquipmentDocument<'weapon' | 'implement'> | null>(
		(possibleTools && possibleTools[0]) ?? null
	);
	const [{ bonusFormula, bonusByType }, setBonusInfo] = useState<{
		bonusFormula: RollComponent;
		bonusByType: BonusByType;
	}>({ bonusFormula: '', bonusByType: {} });
	const [tokenBonuses, setTokenBonuses] = useState<Record<string, BonusByType>>({});

	const currentRoll = combineRollComponents(baseDice, bonusFormula);

	return (
		<div className="grid grid-cols-1 w-full gap-1">
			<BlockHeader>{baseDice}</BlockHeader>
			<ToolSelector possibleTools={possibleTools} tool={tool} onChangeTool={setTool} />
			<NumericModifierSelector
				showApplied
				actor={actor}
				tool={tool}
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
							targetBonuses: tokenBonuses,
						})
					}>
					Roll {currentRoll}
				</AppButton>
			</div>

			{runtimeTargetsRollType && runtimeBonusParameters.targets ? (
				<AdditionalTargetModifiers
					rollTarget={runtimeTargetsRollType}
					tokens={runtimeBonusParameters.targets.filter(
						(target): target is TokenDocument & { id: string; actor: ActorDocument } => !!target.actor
					)}
					runtimeBonusParameters={runtimeBonusParameters}
					onBonusesChange={(targetId, bonusFormula, bonusByType) =>
						setTokenBonuses((state) => ({ ...state, [targetId]: bonusByType }))
					}
				/>
			) : null}
		</div>
	);
}

function AdditionalTargetModifiers({
	rollTarget,
	tokens,
	runtimeBonusParameters,
	onBonusesChange,
}: {
	rollTarget: NumericBonusTarget;
	tokens: (TokenDocument & { id: string; actor: ActorDocument })[];
	runtimeBonusParameters: ConditionRulesRuntimeParameters;
	onBonusesChange(targetId: string, bonusFormula: RollComponent, bonusByType: BonusByType): void;
}) {
	const hover = useHoverToken();
	const control = useControlTokenOnClick();

	const [activeTab, setActiveTab] = useState(tokens[0]?.id ?? '');
	if (tokens.length === 0) return null;

	return (
		<div className="mt-4">
			<Tabs.Controlled activeTab={activeTab} setActiveTab={setActiveTab} renderAllTabs>
				<Tabs.Nav>
					{tokens.map((token) => (
						<Tabs.NavButton tabName={token.id} key={token.id}>
							<img className="h-12 w-12 inline" src={token.data.img ?? ''} />
						</Tabs.NavButton>
					))}
				</Tabs.Nav>

				<section className="flex-grow">
					{tokens.map((token) => (
						<Tabs.Tab tabName={token.id} key={token.id}>
							<BlockHeader {...hover(() => token)} {...control(() => token)}>
								{token.name}
							</BlockHeader>
							<NumericModifierSelector
								actor={token.actor}
								tool={null}
								onBonusesChange={(bonusFormula, bonusByType) => onBonusesChange(token.id, bonusFormula, bonusByType)}
								rollTarget={rollTarget}
								runtimeBonusParameters={runtimeBonusParameters}
							/>
						</Tabs.Tab>
					))}
				</section>
			</Tabs.Controlled>
		</div>
	);
}
