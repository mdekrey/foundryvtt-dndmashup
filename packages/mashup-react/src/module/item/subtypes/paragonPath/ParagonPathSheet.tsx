import { FormInput } from '@foundryvtt-dndmashup/components';
import { Bonuses, DynamicList } from '@foundryvtt-dndmashup/mashup-rules';
import { Tabs } from '@foundryvtt-dndmashup/components';
import { FeaturesList } from '../../components/FeaturesList';
import { Lens } from '@foundryvtt-dndmashup/core';
import { ParagonPathData, ParagonPathDocument } from './dataSourceData';
import { documentAsState, SimpleDocumentData } from '@foundryvtt-dndmashup/foundry-compat';

const baseLens = Lens.identity<SimpleDocumentData<ParagonPathData>>();
const imageLens = baseLens.toField('img');
const dataLens = baseLens.toField('data');
const bonusesLens = dataLens.toField('grantedBonuses');
const dynamicListLens = dataLens.toField('dynamicList');

export function ParagonPathSheet({ item }: { item: ParagonPathDocument }) {
	const documentState = documentAsState(item);
	return (
		<div className="h-full flex flex-col gap-1">
			<div className="flex flex-row gap-1">
				<FormInput.ImageEditor
					{...imageLens.apply(documentState)}
					title={item.name}
					className="w-24 h-24 border-2 border-black p-px"
				/>
				<div className="grid grid-cols-12 grid-rows-2 gap-x-1 items-end flex-grow text-lg">
					<FormInput className="col-span-12">
						<FormInput.TextField {...baseLens.toField('name').apply(documentState)} />
						<FormInput.Label>Paragon Path Name</FormInput.Label>
					</FormInput>
				</div>
			</div>
			<div className="border-b border-black"></div>
			<Tabs defaultActiveTab="bonuses">
				<Tabs.Nav>
					<Tabs.NavButton tabName="bonuses">Bonuses</Tabs.NavButton>
					{item.items.contents.filter((item) => item.type !== 'equipment').length ? (
						<Tabs.NavButton tabName="features">Features</Tabs.NavButton>
					) : null}
				</Tabs.Nav>

				<section className="flex-grow">
					<Tabs.Tab tabName="bonuses">
						<Bonuses bonuses={bonusesLens.apply(documentState)} className="flex-grow" />
						<DynamicList dynamicList={dynamicListLens.apply(documentState)} />
					</Tabs.Tab>
					<Tabs.Tab tabName="features">
						<FeaturesList items={item.items.contents} />
					</Tabs.Tab>
				</section>
			</Tabs>
		</div>
	);
}
