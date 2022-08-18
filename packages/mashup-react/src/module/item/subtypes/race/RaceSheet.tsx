import { FormInput, SelectItem, TabbedSheet } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { SimpleDocument, SimpleDocumentData } from '@foundryvtt-dndmashup/foundry-compat';
import { BonusesEditor, DynamicList } from '@foundryvtt-dndmashup/mashup-rules';
import { FeaturesList } from '../../components/FeaturesList';
import { RaceData } from './dataSourceData';
import { sizes, Size } from '@foundryvtt-dndmashup/mashup-rules';
import { capitalize } from 'lodash/fp';
import { useState } from 'react';

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
	const [activeTab, setActiveTab] = useState('bonuses');
	return (
		<TabbedSheet
			img={imageLens.apply(documentState)}
			name={item.name}
			headerSection={
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
			}
			tabState={{ activeTab, setActiveTab }}>
			<TabbedSheet.Tab name="bonuses" label="Bonuses">
				<BonusesEditor bonuses={bonusesLens.apply(documentState)} className="flex-grow" />
				<DynamicList dynamicList={dynamicListLens.apply(documentState)} />
			</TabbedSheet.Tab>
			{items.filter((item) => item.type !== 'equipment').length ? (
				<TabbedSheet.Tab name="features" label="Features">
					<FeaturesList items={items} />
				</TabbedSheet.Tab>
			) : null}
		</TabbedSheet>
	);
}
