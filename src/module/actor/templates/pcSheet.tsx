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
						<nav data-group="primary" className="flex justify-around border-b border-black">
							<label
								data-tab="details"
								className="ring-transparent hover:ring-blue-bright-600 cursor-pointer ring-text-shadow uppecase">
								Details
							</label>
							<label
								data-tab="inventory"
								className="ring-transparent hover:ring-blue-bright-600 cursor-pointer ring-text-shadow uppecase">
								Inventory
							</label>
							<label
								data-tab="powers"
								className="ring-transparent hover:ring-blue-bright-600 cursor-pointer ring-text-shadow uppecase">
								Powers
							</label>
							<label
								data-tab="features"
								className="ring-transparent hover:ring-blue-bright-600 cursor-pointer ring-text-shadow uppecase">
								Features
							</label>
							<label
								data-tab="feats"
								className="ring-transparent hover:ring-blue-bright-600 cursor-pointer ring-text-shadow uppecase">
								Feats
							</label>
							<label
								data-tab="effects"
								className="ring-transparent hover:ring-blue-bright-600 cursor-pointer ring-text-shadow uppecase">
								Effects
							</label>
						</nav>

						<section className="flex-grow" data-tab-section>
							<div className="tab w-full h-full" data-group="primary" data-tab="details">
								<Details actor={actor} />
							</div>
							<div className="tab w-full h-full" data-group="primary" data-tab="inventory">
								<Inventory actor={actor} />
							</div>
							<div className="tab w-full h-full" data-group="primary" data-tab="powers">
								<Powers actor={actor} />
							</div>
							<div className="tab w-full h-full" data-group="primary" data-tab="features">
								<Features actor={actor} />
							</div>
							<div className="tab w-full h-full" data-group="primary" data-tab="feats">
								<Feats actor={actor} />
							</div>
							<div className="tab w-full h-full" data-group="primary" data-tab="effects">
								<Effects actor={actor} />
							</div>
						</section>
					</div>
				</div>
			</article>
		</>
	);
}
