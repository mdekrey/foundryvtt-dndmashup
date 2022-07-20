import { Tabs } from '@foundryvtt-dndmashup/components';
import { SpecificActor } from '../mashup-actor';
import { ActorComponents } from '@foundryvtt-dndmashup/mashup-react';
import { documentAsState } from '@foundryvtt-dndmashup/foundry-compat';
import { Lens, Stateful } from '@foundryvtt-dndmashup/mashup-core';
import { Ability } from '@foundryvtt-dndmashup/mashup-react';
import { SpecificActorData } from '../types';
import { ActorDataSource } from '@foundryvtt-dndmashup/mashup-react';
import { SimpleDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { PossibleItemData } from '../../item/types';

const baseLens = Lens.identity<SpecificActorData<'pc'>>();
const dataLens = baseLens.toField('data');
const abilitiesLens = dataLens.toField('abilities');
const healthLens = dataLens.toField('health');
const actionPointsLens = dataLens.toField('actionPoints');
const detailsLens = dataLens.toField('details').toField('biography');

export function PcSheet({ actor }: { actor: SpecificActor<'pc'> }) {
	const documentState = documentAsState<SpecificActorData<'pc'>>(actor);

	// TODO: derived data doesn't need to go to actor.data
	const data = actor.derivedData;
	const defenses = data.defenses;
	const maxHp = data.health.maxHp;
	const healingSurgeValue = data.health.surges.value;
	const healingSurgesPerDay = data.health.surges.max;
	const getFinalScore = (ability: Ability) => data.abilities[ability];

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
					<section className="flex flex-col items-center">
						<ActorComponents.HitPoints healthState={healthLens.apply(documentState)} maxHp={maxHp} />
					</section>
					<div className="border-r-2 border-black"></div>

					<section className="flex flex-col items-center">
						<ActorComponents.Defenses defenses={defenses} />
					</section>
					<div className="border-r-2 border-black"></div>

					<section className="flex flex-col items-center">
						<ActorComponents.HealingSurges
							healingSurgeValue={healingSurgeValue}
							healingSurgesPerDay={healingSurgesPerDay}
							healthState={healthLens.apply(documentState)}
						/>
					</section>
					<div className="border-r-2 border-black"></div>

					<section className="flex flex-col items-center">
						<ActorComponents.ActionPoints actionPointsState={actionPointsLens.apply(documentState)} />
					</section>
				</div>

				<div className="flex-grow flex flex-row gap-1">
					<div>
						<ActorComponents.Abilities
							abilitiesState={abilitiesLens.apply(documentState)}
							getFinalScore={getFinalScore}
						/>
					</div>
					<div className="border-r-2 border-black"></div>
					<div className="flex-grow flex flex-col">
						<Tabs defaultActiveTab="details">
							<Tabs.Nav>
								<Tabs.NavButton tabName="details">Details</Tabs.NavButton>
								<Tabs.NavButton tabName="inventory">Inventory</Tabs.NavButton>
								<Tabs.NavButton tabName="powers">Powers</Tabs.NavButton>
								<Tabs.NavButton tabName="features">Features</Tabs.NavButton>
								<Tabs.NavButton tabName="feats">Feats</Tabs.NavButton>
								<Tabs.NavButton tabName="effects">Effects</Tabs.NavButton>
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
									<ActorComponents.Features items={actor.items.contents as SimpleDocument<PossibleItemData>[]} />
								</Tabs.Tab>
								<Tabs.Tab tabName="feats">
									<ActorComponents.Feats items={actor.items.contents} />
								</Tabs.Tab>
								<Tabs.Tab tabName="effects">
									<ActorComponents.Effects
										{...(dataLens.apply(documentState) as never as Stateful<ActorDataSource['data']>)}
										bonusList={actor.specialBonuses}
									/>
								</Tabs.Tab>
							</section>
						</Tabs>
					</div>
				</div>
			</article>
		</>
	);
}
