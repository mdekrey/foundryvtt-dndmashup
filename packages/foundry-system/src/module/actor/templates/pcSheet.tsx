import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { Tabs } from '@foundryvtt-dndmashup/components';
import { documentAsState, SimpleDocument } from '@foundryvtt-dndmashup/foundry-compat';
import {
	ActiveEffectDocument,
	ActorComponents,
	PlayerCharacterDataSourceData,
} from '@foundryvtt-dndmashup/mashup-react';
import { SpecificActor } from '../mashup-actor';
import { SpecificActorData } from '../types';
import { PossibleItemData } from '../../item/types';

const baseLens = Lens.identity<SpecificActorData<'pc'>>();
const dataLens = baseLens.toField('data');
const abilitiesLens = dataLens.toField('abilities');
const healthLens = dataLens.toField('health');
const actionPointsLens = dataLens.toField('actionPoints');
const detailsLens = dataLens.toField('details').toField('biography');
const skillsLens = dataLens.toField('skills').default([]);
const poolsLens = dataLens.toField('pools').default([]);
const bonusesLens = dataLens.toField('bonuses');
const dynamicListLens = dataLens.toField('dynamicList');

export function PcSheet({ actor, onRollInitiative }: { actor: SpecificActor<'pc'>; onRollInitiative: () => void }) {
	const documentState = documentAsState<SpecificActorData<'pc'>>(actor);
	const dataState: Stateful<PlayerCharacterDataSourceData> = dataLens.apply(documentState);

	const data = actor.derivedData;
	const defenses = data.defenses;
	const maxHp = data.health.hp.max;
	const healingSurgeValue = data.health.surgesValue;
	const healingSurgesPerDay = data.health.surgesRemaining.max;
	const pools = data.poolLimits;

	return (
		<>
			<article className="flex flex-col h-full">
				<header className="flex flex-row gap-1">
					<ActorComponents.Header
						nameState={baseLens.toField('name').apply(documentState)}
						imageState={baseLens.toField('img').apply(documentState)}
						detailsState={baseLens.toField('data').toField('details').apply(documentState)}
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
						<Tabs defaultActiveTab="details">
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
								</Tabs.Tab>
								<Tabs.Tab tabName="powers">
									<ActorComponents.Powers actor={actor} />
								</Tabs.Tab>
								<Tabs.Tab tabName="features">
									<ActorComponents.Features
										effects={actor.effects.contents as ActiveEffectDocument[]}
										items={actor.items.contents as SimpleDocument<PossibleItemData>[]}
										bonuses={bonusesLens.apply(documentState)}
										dynamicList={dynamicListLens.apply(documentState)}
									/>
								</Tabs.Tab>
								<Tabs.Tab tabName="effects">
									<ActorComponents.Effects bonusList={actor.specialBonuses} dynamicList={actor.dynamicListResult} />
								</Tabs.Tab>
								<Tabs.Tab tabName="pools">
									<ActorComponents.Pools poolLimits={pools} poolsState={poolsLens.apply(documentState)} />
								</Tabs.Tab>
							</section>
						</Tabs>
					</div>
				</div>
			</article>
		</>
	);
}
