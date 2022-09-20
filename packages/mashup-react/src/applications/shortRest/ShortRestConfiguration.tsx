import { useState } from 'react';
import { AppButton, BlockHeader, FormInput } from '@foundryvtt-dndmashup/components';
import { lensFromState } from '@foundryvtt-dndmashup/core';
import { ActorDocument } from '../../module/actor/documentType';
import { useChatMessageDispatcher } from '../../module';
import { NumericModifierSelector } from '../diceRoll/NumericModifierSelector';
import { BonusByType, combineRollComponents, RollComponent } from '@foundryvtt-dndmashup/mashup-rules';
import classNames from 'classnames';
import { emptyConditionRuntime } from '../../bonusConditionRules';

export function ShortRestConfiguration({ actor, onClose }: { actor: ActorDocument; onClose: () => void }) {
	const spendHealingSurges = lensFromState(useState(0));
	const [{ bonusFormula, bonusByType }, setBonusInfo] = useState<{
		bonusFormula: RollComponent;
		bonusByType: BonusByType;
	}>({ bonusFormula: '', bonusByType: {} });
	const chatDispatch = useChatMessageDispatcher();
	const currentRoll = combineRollComponents(actor.derivedCache.bonuses.getValue('surges-value'), bonusFormula);

	const isDeterministic = typeof currentRoll === 'number';
	const rollTotal =
		typeof currentRoll === 'number'
			? currentRoll * spendHealingSurges.value
			: `${spendHealingSurges.value} * (${currentRoll})`;
	const hpResult =
		typeof rollTotal === 'number'
			? Math.min(actor.derivedData.health.hp.max, actor.data.data.health.hp.value + rollTotal)
			: null;

	return (
		<>
			<BlockHeader>Short Rest</BlockHeader>
			<div className="flex flex-row gap-1 justify-center items-baseline">
				<FormInput className="w-16 inline-block">
					<FormInput.NumberField
						min={0}
						max={actor.data.data.health.surgesRemaining.value}
						{...spendHealingSurges}
						className="text-lg text-center"
					/>
					<FormInput.Label>To Spend</FormInput.Label>
				</FormInput>
				<span>of {actor.data.data.health.surgesRemaining.value} remaining healing surges</span>
			</div>
			<NumericModifierSelector
				actor={actor}
				tool={null}
				onBonusesChange={(bonusFormula, bonusByType) => setBonusInfo({ bonusFormula, bonusByType })}
				rollTarget={'surges-value'}
				runtimeBonusParameters={emptyConditionRuntime}
			/>
			<BlockHeader>Short Rest Effects</BlockHeader>
			<ul className="list-disc ml-4 min-h-64">
				{/* TODO: make this dynamic to include all of them */}
				{spendHealingSurges.value > 0 ? (
					<>
						<li>
							Heal {rollTotal} hp, raising from {actor.data.data.health.hp.value}
							{hpResult ? (
								<>
									{' '}
									to {hpResult} of {actor.derivedData.health.hp.max}
								</>
							) : null}
						</li>
						<li>
							Spend {spendHealingSurges.value} healing {spendHealingSurges.value === 1 ? 'surge' : 'surges'}
						</li>
					</>
				) : null}
				<li>Recover all encounter powers</li>
			</ul>
			<div className="grid grid-cols-2 gap-1">
				<AppButton onClick={onClose}>Cancel</AppButton>
				<AppButton
					onClick={onUseShortRest}
					className={classNames({
						'opacity-50': !isDeterministic,
					})}>
					Take Short Rest
				</AppButton>
			</div>
		</>
	);

	async function onUseShortRest() {
		const hpToRecover = hpResult === null ? null : hpResult - actor.data.data.health.hp.value;
		if (!isDeterministic) return;
		if (!(await actor.applyShortRest(spendHealingSurges.value, bonusByType))) return;
		chatDispatch.sendChatMessage(
			'plain-text',
			actor,
			`takes a short rest${
				hpResult === null
					? ''
					: `, spending ${spendHealingSurges.value} healing ${
							spendHealingSurges.value === 1 ? 'surge' : 'surges'
					  } to recover ${hpToRecover} hp.`
			}`
		);
		onClose();
	}
}
