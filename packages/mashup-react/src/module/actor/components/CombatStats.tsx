import { ensureSign, Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { FormInput, ImageButton } from '@foundryvtt-dndmashup/components';
import { useApplicationDispatcher } from '@foundryvtt-dndmashup/foundry-compat';
import { PlayerCharacterDataSourceData } from '../types';
import { ActorDocument } from '../documentType';
import { ActorDerivedData } from '../derivedDataType';
import { emptyConditionRuntime } from '../../../bonusConditionRules';

const deathSavingThrowLens = Lens.fromProp<PlayerCharacterDataSourceData>()('health').toField('deathSavesRemaining');
const encountersSinceLongRest = Lens.fromProp<PlayerCharacterDataSourceData>()('encountersSinceLongRest');

export function CombatStats({
	actor,
	data,
	onRollInitiative,
	dataState,
}: {
	actor: ActorDocument;
	data: ActorDerivedData;
	onRollInitiative: () => void;
	dataState: Stateful<PlayerCharacterDataSourceData>;
}) {
	return (
		<div className="flex text-lg justify-around items-center">
			<div className="group">
				<span className="font-bold">{ensureSign(data.initiative)}</span> Initiative
				<ImageButton
					className="ml-1 invisible group-hover:visible"
					src="/icons/svg/d20-black.svg"
					onClick={onRollInitiative}
				/>
			</div>
			<div>
				<span className="font-bold">{actor.derivedCache.bonuses.getValue('speed')} sq.</span> Speed
			</div>
			<div>
				<SavingThrowSection actor={actor} />
			</div>
			<div className="flex flex-row group items-center">
				<DeathSavingThrowSection actor={actor} {...deathSavingThrowLens.apply(dataState)} />
			</div>
			<div className="flex flex-row group items-center">
				<EncountersSection milestones={actor.milestones} {...encountersSinceLongRest.apply(dataState)} />
			</div>
		</div>
	);
}

function SavingThrowSection({ actor }: { actor: ActorDocument }) {
	const applicationContext = useApplicationDispatcher();
	return (
		<>
			Saving Throw
			<ImageButton className="ml-1" src="/icons/svg/d20-black.svg" onClick={onSavingThrow} />
		</>
	);

	function onSavingThrow() {
		applicationContext.launchApplication('diceRoll', {
			actor,
			baseDice: 'd20',
			rollType: 'saving-throw',
			allowToolSelection: false,
			sendToChat: true,
			title: `${actor.name}'s Saving Throw`,
			flavor: '... makes a saving throw',
			runtimeBonusParameters: { ...emptyConditionRuntime },
		});
	}
}

function DeathSavingThrowSection({ actor, ...deathSavingThrowState }: { actor: ActorDocument } & Stateful<number>) {
	const applicationContext = useApplicationDispatcher();
	return (
		<>
			<FormInput className="w-20 inline-block">
				<FormInput.NumberField {...deathSavingThrowState} className="text-center" />
				<FormInput.Label>Death Saves</FormInput.Label>
			</FormInput>

			<ImageButton
				className="ml-1 invisible group-hover:visible"
				src="/icons/svg/d20-black.svg"
				onClick={onSavingThrow}
			/>
		</>
	);

	async function onSavingThrow() {
		try {
			const { result } = await applicationContext.launchApplication('diceRoll', {
				actor,
				baseDice: 'd20',
				rollType: 'saving-throw',
				allowToolSelection: false,
				sendToChat: true,
				title: `${actor.name}'s Death Saving Throw`,
				flavor: `${actor.name} is in the throws of death`,
				runtimeBonusParameters: { ...emptyConditionRuntime },
			});
			const rollResult = await result;
			if (rollResult < 10) {
				deathSavingThrowState.onChangeValue((prev) => prev - 1);
			}
		} catch (ex) {
			// no need to do anything with a cancellation
		}
	}
}

function EncountersSection({ milestones, ...encountersState }: { milestones: number } & Stateful<number>) {
	return (
		<div className="flex flex-col items-center">
			<FormInput className="w-20">
				<FormInput.NumberField {...encountersState} className="text-center" />
				<FormInput.Label>Encounters</FormInput.Label>
			</FormInput>
			<p className="text-xs">Milestones: {milestones}</p>
		</div>
	);
}
