import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { AppButton, Tabs } from '@foundryvtt-dndmashup/components';
import { documentAsState, StandardData, useUserPreference } from '@foundryvtt-dndmashup/foundry-compat';
import { ActiveEffectDocument, ActorComponents, PlayerCharacterSystemData } from '@foundryvtt-dndmashup/mashup-react';
import { MashupActor, SpecificActor } from '../mashup-actor';
import { SpecificActorDataSource } from '../types';
import { useMemo } from 'react';
import { Defense } from '@foundryvtt-dndmashup/mashup-rules';

const baseLens = Lens.identity<StandardData & SpecificActorDataSource<'pc'>>();
const dataLens = baseLens.toField('system');
const abilitiesLens = dataLens.toField('abilities');
const healthLens = dataLens.toField('health');
const actionPointsLens = dataLens.toField('actionPoints');
const detailsLens = dataLens.toField('details').toField('biography');
const skillsLens = dataLens.toField('skills').default([]);
const poolsLens = dataLens.toField('pools').default([]);
const bonusesLens = dataLens.toField('bonuses');
const dynamicListLens = dataLens.toField('dynamicList');
const currencyLens = dataLens.toField('currency');
const magicItemUsesLens = dataLens.toField('magicItemUse').toField('used').default(0);

function useDefenses(actor: MashupActor): {
	[defense in Defense]: number;
} {
	const bonuses = actor.derivedCache.bonuses;
	return useMemo(
		() => ({
			ac: bonuses.getValue('defense-ac'),
			fort: bonuses.getValue('defense-fort'),
			refl: bonuses.getValue('defense-refl'),
			will: bonuses.getValue('defense-will'),
		}),
		[bonuses]
	);
}

function usePoolLimits(actor: MashupActor) {
	const pools = actor.derivedCache.pools;
	return useMemo(() => pools.getPools().map((poolName) => pools.getValue(poolName)), [pools]);
}

export function PcSheet({ actor, onRollInitiative }: { actor: SpecificActor<'pc'>; onRollInitiative: () => void }) {
	const documentState = documentAsState<StandardData & SpecificActorDataSource<'pc'>>(actor);
	const dataState: Stateful<PlayerCharacterSystemData> = dataLens.apply(documentState);

	const data = actor.derivedData;
	const defenses = useDefenses(actor);
	const maxHp = data.health.hp.max;
	const healingSurgeValue = actor.derivedCache.bonuses.getValue('surges-value');
	const healingSurgesPerDay = data.health.surgesRemaining.max;
	const pools = usePoolLimits(actor);

	const [activeTab, setActiveTab] = useUserPreference<string>('pc-sheet-tab', 'details');

	return (
		<>
			<article className="flex flex-col h-full">
				<header className="flex flex-row gap-1">
					<ActorComponents.Header
						nameState={baseLens.toField('name').apply(documentState)}
						imageState={baseLens.toField('img').apply(documentState)}
						detailsState={baseLens.toField('system').toField('details').apply(documentState)}
						appliedClass={actor.appliedClass}
						appliedRace={actor.appliedRace}
						appliedParagonPath={actor.appliedParagonPath}
						appliedEpicDestiny={actor.appliedEpicDestiny}
					/>
				</header>

				<div className="flex gap-1 flex-row border-t-2 border-b-2 border-black m-1 p-1 justify-around">
					<ActorComponents.HitPoints healthState={healthLens.apply(documentState)} maxHp={maxHp} />
					<div className="border-r-2 border-black"></div>

					<ActorComponents.Defenses defenses={defenses} />
					<div className="border-r-2 border-black"></div>

					<ActorComponents.HealingSurges
						healingSurgeValue={healingSurgeValue}
						healingSurgesPerDay={healingSurgesPerDay}
						healthState={healthLens.apply(documentState)}
					/>
					<div className="border-r-2 border-black"></div>

					<ActorComponents.ActionPoints actionPointsState={actionPointsLens.apply(documentState)} />
				</div>

				<div className="flex-grow flex flex-row gap-1">
					<div>
						<ActorComponents.Abilities actor={actor} abilitiesState={abilitiesLens.apply(documentState)} />
						<ActorComponents.Skills actor={actor} skillsState={skillsLens.apply(documentState)} />
					</div>
					<div className="border-r-2 border-black"></div>
					<div className="flex-grow flex flex-col">
						<ActorComponents.CombatStats
							actor={actor}
							data={data}
							onRollInitiative={onRollInitiative}
							dataState={dataState}
						/>
						<div className="border-b-2 border-black"></div>
						<Tabs.Controlled activeTab={activeTab} setActiveTab={setActiveTab}>
							<Tabs.Nav>
								<Tabs.NavButton tabName="details">Biography</Tabs.NavButton>
								<Tabs.NavButton tabName="inventory">Inventory</Tabs.NavButton>
								<Tabs.NavButton tabName="powers">Powers</Tabs.NavButton>
								<Tabs.NavButton tabName="features">Features</Tabs.NavButton>
								<Tabs.NavButton tabName="effects">Effects</Tabs.NavButton>
								<Tabs.NavButton tabName="pools">Resources</Tabs.NavButton>
							</Tabs.Nav>
							<section className="flex-grow">
								<Tabs.Tab tabName="details">
									<ActorComponents.Details isEditor={actor.isOwner} {...detailsLens.apply(documentState)} />
								</Tabs.Tab>
								<Tabs.Tab tabName="inventory">
									<ActorComponents.Inventory actor={actor} />
									<ActorComponents.Currency {...currencyLens.apply(documentState)} />
								</Tabs.Tab>
								<Tabs.Tab tabName="powers">
									<ActorComponents.Powers actor={actor} />
								</Tabs.Tab>
								<Tabs.Tab tabName="features">
									<div className="flex gap-1 justify-end">
										<AppButton onClick={() => actor.importChildItem('feature')}>New</AppButton>
									</div>
									<ActorComponents.Features
										actor={actor}
										effects={actor.effects.contents as ActiveEffectDocument[]}
										items={actor.items.contents}
										bonuses={bonusesLens.apply(documentState)}
										dynamicList={dynamicListLens.apply(documentState)}
									/>
								</Tabs.Tab>
								<Tabs.Tab tabName="effects">
									<ActorComponents.Effects
										actor={actor}
										bonusList={actor.derivedCache.bonuses.getAll()}
										triggeredEffects={actor.derivedCache.triggeredEffects.getAll()}
										dynamicList={actor.derivedCache.lists.getAll()}
									/>
								</Tabs.Tab>
								<Tabs.Tab tabName="pools">
									<ActorComponents.Pools
										magicItemUsesPerDay={actor.derivedCache.bonuses.getValue('magic-item-uses')}
										magicItemUses={magicItemUsesLens.apply(documentState)}
										poolLimits={pools}
										poolsState={poolsLens.apply(documentState)}
									/>
								</Tabs.Tab>
							</section>
						</Tabs.Controlled>
					</div>
				</div>
			</article>
		</>
	);
}
