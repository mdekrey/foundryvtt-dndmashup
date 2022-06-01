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

export function PcSheet({ actor }: { actor: SpecificActor<'pc'> }) {
	return (
		<>
			<article className="flex flex-col h-full">
				<header className="flex flex-row gap-1">
					<Header actor={actor} />
				</header>

				<div className="flex gap-1 flex-row border-t-2 border-b-2 border-black m-1 p-1 justify-around">
					<section className="flex flex-col items-center">
						<HitPoints actor={actor} />
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
						<Abilities actor={actor} />
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
