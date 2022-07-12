import { FormInput } from 'src/components/form-input';
import { ImageEditor } from 'src/components/image-editor';
import { Bonuses } from 'src/module/bonuses';
import { Tabs } from 'src/components/tab-section';
import { FeaturesList } from '../../components/FeaturesList';
import { Lens } from 'src/core/lens';
import { documentAsState } from 'src/components/form-input/hooks/useDocumentAsState';
import { EpicDestinyData, EpicDestinyDocument } from './dataSourceData';
import { SimpleDocumentData } from 'dndmashup-react/core/interfaces/simple-document';

const baseLens = Lens.identity<SimpleDocumentData<EpicDestinyData>>();
const nameLens = baseLens.toField('name');
const imageLens = baseLens.toField('img');
const dataLens = baseLens.toField('data');
const bonusesLens = dataLens.toField('grantedBonuses');

export function EpicDestinySheet({ item }: { item: EpicDestinyDocument }) {
	const documentState = documentAsState(item, { deleteData: true });

	return (
		<div className="h-full flex flex-col gap-1">
			<div className="flex flex-row gap-1">
				<ImageEditor
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
						<Bonuses bonuses={bonusesLens.apply(documentState)} className="flex-grow" />
					</Tabs.Tab>
					<Tabs.Tab tabName="features">
						<FeaturesList items={item.items.contents} />
					</Tabs.Tab>
				</section>
			</Tabs>
		</div>
	);
}
