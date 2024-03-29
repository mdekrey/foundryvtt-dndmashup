import { FormInput, Tabs } from '@foundryvtt-dndmashup/components';
import { BonusesEditor, DynamicList } from '@foundryvtt-dndmashup/mashup-rules';
import { FeaturesList } from '../../components/FeaturesList';
import { Lens } from '@foundryvtt-dndmashup/core';
import { documentAsState } from '@foundryvtt-dndmashup/foundry-compat';
import { EpicDestinyData, EpicDestinyDocument } from './dataSourceData';
import { SimpleDocumentData } from '@foundryvtt-dndmashup/foundry-compat';

const baseLens = Lens.identity<SimpleDocumentData<EpicDestinyData>>();
const nameLens = baseLens.toField('name');
const imageLens = baseLens.toField('img');
const dataLens = baseLens.toField('system');
const bonusesLens = dataLens.toField('grantedBonuses');
const dynamicListLens = dataLens.toField('dynamicList');

export function EpicDestinySheet({ item }: { item: EpicDestinyDocument }) {
	const documentState = documentAsState(item, { deleteData: true });

	return (
		<div className="h-full flex flex-col gap-1">
			<div className="flex flex-row gap-1">
				<FormInput.ImageEditor
					{...imageLens.apply(documentState)}
					title={item.name}
					className="w-24 h-24 border-2 border-black p-px"
				/>
				<div className="grid grid-cols-12 grid-rows-2 gap-x-1 items-end flex-grow">
					<FormInput className="col-span-12">
						<FormInput.TextField {...nameLens.apply(documentState)} className="text-lg" />
						<FormInput.Label>Epic Destiny Name</FormInput.Label>
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
						<BonusesEditor bonuses={bonusesLens.apply(documentState)} className="flex-grow" />
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
