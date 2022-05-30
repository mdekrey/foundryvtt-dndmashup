import { SpecificActor } from '../mashup-actor';
import { Header } from '../components/Header';
import { HitPoints } from '../components/HitPoints';
import { Defenses } from '../components/Defenses';
import { HealingSurges } from '../components/HealingSurges';
import { ActionPoints } from '../components/ActionPoints';

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
					<div>{/* <Abilities /> */}</div>
					<div className="border-r-2 border-black"></div>
					<div className="flex-grow flex flex-col">
						<nav data-group="primary" className="flex justify-around border-b border-black">
							<label data-tab="details" className="link uppecase">
								Details
							</label>
							<label data-tab="inventory" className="link uppecase">
								Inventory
							</label>
							<label data-tab="powers" className="link uppecase">
								Powers
							</label>
							<label data-tab="features" className="link uppecase">
								Features
							</label>
							<label data-tab="feats" className="link uppecase">
								Feats
							</label>
							<label data-tab="effects" className="link uppecase">
								Effects
							</label>
						</nav>

						<section className="flex-grow" data-tab-section>
							<div className="tab w-full h-full" data-group="primary" data-tab="details">
								{/* <Details /> */}
							</div>
							<div className="tab w-full h-full" data-group="primary" data-tab="inventory">
								{/* <Inventory /> */}
							</div>
							<div className="tab w-full h-full" data-group="primary" data-tab="powers">
								{/* <Powers /> */}
							</div>
							<div className="tab w-full h-full" data-group="primary" data-tab="features">
								{/* <Features /> */}
							</div>
							<div className="tab w-full h-full" data-group="primary" data-tab="feats">
								{/* <Feats /> */}
							</div>
							<div className="tab w-full h-full" data-group="primary" data-tab="effects">
								{/* <Effects /> */}
							</div>
						</section>
					</div>
				</div>
			</article>
		</>
	);
}
