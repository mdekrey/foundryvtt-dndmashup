import { Tabs } from 'src/components/tab-section';
import { SpecificActor } from '../mashup-actor';
import { Header } from '../components/Header';
import { HitPoints } from '../components/HitPoints';
import { Defenses } from '../components/Defenses';
import { HealingSurges } from '../components/HealingSurges';
import { ActionPoints } from '../components/ActionPoints';
import { Abilities } from '../components/Abilities';

import { Details } from '../components/Details';
import { Inventory } from '../components/Inventory';
import { Powers } from '../components/Powers';
import { Features } from '../components/Features';
import { Feats } from '../components/Feats';
import { Effects } from '../components/Effects';
import { documentAsState, Stateful } from 'src/components/form-input/hooks/useDocumentAsState';
import { Lens } from 'src/core/lens';
import { SourceDataOf } from 'src/core/foundry';
import { Ability } from 'src/types/types';
import { ActorDataSource } from '../types';
import { SimpleDocument } from 'src/core/interfaces/simple-document';
import { PossibleItemData } from 'src/module/item/types';

const baseLens = Lens.identity<SourceDataOf<SpecificActor<'pc'>>>();
const dataLens = baseLens.toField('data');
const abilitiesLens = dataLens.toField('abilities');
const healthLens = dataLens.toField('health');
const actionPointsLens = dataLens.toField('actionPoints');

export function PcSheet({ actor }: { actor: SpecificActor<'pc'> }) {
	const documentState = documentAsState(actor);

	// TODO: derived data doesn't need to go to actor.data
	const data = actor.data;
	const defenses = data.data.defenses;
	const maxHp = data.data.health.maxHp;
	const healingSurgeValue = data.data.health.surges.value;
	const healingSurgesPerDay = data.data.health.surges.max;
	const getFinalScore = (ability: Ability) => data.data.abilities[ability].final;

	return (
		<>
			<article className="flex flex-col h-full">
				<header className="flex flex-row gap-1">
					<Header
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
						<HitPoints healthState={healthLens.apply(documentState)} maxHp={maxHp} />
					</section>
					<div className="border-r-2 border-black"></div>

					<section className="flex flex-col items-center">
						<Defenses defenses={defenses} />
					</section>
					<div className="border-r-2 border-black"></div>

					<section className="flex flex-col items-center">
						<HealingSurges
							healingSurgeValue={healingSurgeValue}
							healingSurgesPerDay={healingSurgesPerDay}
							healthState={healthLens.apply(documentState)}
						/>
					</section>
					<div className="border-r-2 border-black"></div>

					<section className="flex flex-col items-center">
						<ActionPoints actionPointsState={actionPointsLens.apply(documentState)} />
					</section>
				</div>

				<div className="flex-grow flex flex-row gap-1">
					<div>
						<Abilities abilitiesState={abilitiesLens.apply(documentState)} getFinalScore={getFinalScore} />
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
									<Details actor={actor} />
								</Tabs.Tab>
								<Tabs.Tab tabName="inventory">
									<Inventory actor={actor} />
								</Tabs.Tab>
								<Tabs.Tab tabName="powers">
									<Powers actor={actor} />
								</Tabs.Tab>
								<Tabs.Tab tabName="features">
									<Features items={actor.items.contents as SimpleDocument<PossibleItemData>[]} />
								</Tabs.Tab>
								<Tabs.Tab tabName="feats">
									<Feats items={actor.items.contents} />
								</Tabs.Tab>
								<Tabs.Tab tabName="effects">
									<Effects
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
