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
import { documentAsState } from 'src/components/form-input/hooks/useDocumentAsState';
import { Lens } from 'src/core/lens';
import { SourceDataOf } from 'src/core/foundry';
import { Ability } from 'src/types/types';

const baseLens = Lens.identity<SourceDataOf<SpecificActor<'pc'>>>();
const abilitiesLens = baseLens.toField('data').toField('abilities');
const healthLens = baseLens.toField('data').toField('health');

export function PcSheet({ actor }: { actor: SpecificActor<'pc'> }) {
	const documentState = documentAsState(actor);

	// TODO: derived data doesn't need to go to data
	const maxHp = actor.data.data.health.maxHp;
	const getFinalScore = (ability: Ability) => actor.data.data.abilities[ability].final;

	return (
		<>
			<article className="flex flex-col h-full">
				<header className="flex flex-row gap-1">
					<Header actor={actor} />
				</header>

				<div className="flex gap-1 flex-row border-t-2 border-b-2 border-black m-1 p-1 justify-around">
					<section className="flex flex-col items-center">
						<HitPoints healthState={healthLens.apply(documentState)} maxHp={maxHp} />
					</section>
					<div className="border-r-2 border-black"></div>

					<section className="flex flex-col items-center">
						<Defenses actor={actor} />
					</section>
					<div className="border-r-2 border-black"></div>

					<section className="flex flex-col items-center">
						<HealingSurges actor={actor} />
					</section>
					<div className="border-r-2 border-black"></div>

					<section className="flex flex-col items-center">
						<ActionPoints actor={actor} />
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
									<Features actor={actor} />
								</Tabs.Tab>
								<Tabs.Tab tabName="feats">
									<Feats actor={actor} />
								</Tabs.Tab>
								<Tabs.Tab tabName="effects">
									<Effects actor={actor} />
								</Tabs.Tab>
							</section>
						</Tabs>
					</div>
				</div>
			</article>
		</>
	);
}
