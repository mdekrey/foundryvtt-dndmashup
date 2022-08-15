import { FormInput, SelectItem, Tabs } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { SimpleDocument, SimpleDocumentData } from '@foundryvtt-dndmashup/foundry-compat';
import { Bonuses, DynamicList } from '@foundryvtt-dndmashup/mashup-rules';
import { FeaturesList } from '../../components/FeaturesList';
import { RaceData } from './dataSourceData';
import { sizes, Size } from '@foundryvtt-dndmashup/mashup-rules';
import { capitalize } from 'lodash/fp';

const baseLens = Lens.identity<SimpleDocumentData<RaceData>>();
const imageLens = baseLens.toField('img');
const dataLens = baseLens.toField('data');
const bonusesLens = dataLens.toField('grantedBonuses');
const dynamicListLens = dataLens.toField('dynamicList');

const sizeOptions = sizes.map((v): SelectItem<Size> => ({ value: v, key: v, label: capitalize(v), typeaheadLabel: v }));

export function RaceSheet({
	items,
	...documentState
}: Stateful<SimpleDocumentData<RaceData>> & { items: SimpleDocument[] }) {
	const { value: item } = documentState;
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
						<FormInput.Label>Race Name</FormInput.Label>
					</FormInput>
					<FormInput className="col-span-4">
						<FormInput.Structured>
							<FormInput.Structured.Main>
								<FormInput.NumberField plain {...baseLens.toField('data').toField('baseSpeed').apply(documentState)} />
								<span className="flex-shrink-0">sq.</span>
							</FormInput.Structured.Main>
						</FormInput.Structured>
						<FormInput.Label>Base Speed</FormInput.Label>
					</FormInput>
					<FormInput className="col-span-4">
						<FormInput.Select
							options={sizeOptions}
							{...baseLens.toField('data').toField('size').apply(documentState)}
						/>
						<FormInput.Label>Size</FormInput.Label>
					</FormInput>
				</div>
			</div>
			<div className="border-b border-black"></div>
			<Tabs defaultActiveTab="bonuses">
				<Tabs.Nav>
					<Tabs.NavButton tabName="bonuses">Bonuses</Tabs.NavButton>
					{items.filter((item) => item.type !== 'equipment').length ? (
						<Tabs.NavButton tabName="features">Features</Tabs.NavButton>
					) : null}
				</Tabs.Nav>

				<section className="flex-grow">
					<Tabs.Tab tabName="bonuses">
						<Bonuses bonuses={bonusesLens.apply(documentState)} className="flex-grow" />
						<DynamicList dynamicList={dynamicListLens.apply(documentState)} />
					</Tabs.Tab>
					<Tabs.Tab tabName="features">
						<FeaturesList items={items} />
					</Tabs.Tab>
				</section>
			</Tabs>
		</div>
	);
}
