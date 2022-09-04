import {
	AurasEditor,
	BonusesEditor,
	DynamicList,
	PoolBonusEditor,
	PoolsEditor,
} from '@foundryvtt-dndmashup/mashup-rules';
import { BlockHeader, FormInput, SelectItem, TabbedSheet } from '@foundryvtt-dndmashup/components';
import { documentAsState, SimpleDocumentData } from '@foundryvtt-dndmashup/foundry-compat';
import { FeaturesList } from '../../components/FeaturesList';
import { FeatureType, featureTypes } from './config';
import { Lens } from '@foundryvtt-dndmashup/core';
import { FeatureDocument, FeatureData } from './dataSourceData';
import { useState } from 'react';

const options = Object.entries(featureTypes).map(
	([key, { label: label }]): SelectItem<FeatureType> => ({
		value: key as FeatureType,
		key,
		label,
		typeaheadLabel: label,
	})
);

const baseLens = Lens.identity<SimpleDocumentData<FeatureData>>();
const imageLens = baseLens.toField('img');
const dataLens = baseLens.toField('data');
const bonusesLens = dataLens.toField('grantedBonuses');
const dynamicListLens = dataLens.toField('dynamicList');
const grantedPoolsLens = dataLens.toField('grantedPools').default([]);
const grantedPoolBonusesLens = dataLens.toField('grantedPoolBonuses').default([]);
const aurasLens = dataLens.toField('grantedAuras').default([]);
// const triggeredEffectsLens = dataLens.toField('triggeredEffects').default([]);

export function FeatureSheet({ item }: { item: FeatureDocument }) {
	const [activeTab, setActiveTab] = useState('bonuses');
	const documentState = documentAsState(item);
	return (
		<TabbedSheet
			img={imageLens.apply(documentState)}
			name={item.name}
			tabState={{ activeTab, setActiveTab }}
			headerSection={
				<div className="grid grid-cols-12 grid-rows-2 gap-x-1 items-end flex-grow">
					<FormInput className="col-span-9 text-lg">
						<FormInput.TextField {...baseLens.toField('name').apply(documentState)} />
						<FormInput.Label>Feature Name</FormInput.Label>
					</FormInput>
					<FormInput className="col-span-3">
						<FormInput.Field>
							<FormInput.Select
								{...baseLens.toField('data').toField('featureType').apply(documentState)}
								options={options}
							/>
						</FormInput.Field>
						<FormInput.Label>Type</FormInput.Label>
					</FormInput>
					<FormInput className="col-span-12">
						<FormInput.TextField {...baseLens.toField('data').toField('summary').apply(documentState)} />
						<FormInput.Label>Summary</FormInput.Label>
					</FormInput>
				</div>
			}>
			<TabbedSheet.Tab name="bonuses" label="Bonuses">
				<BlockHeader className="theme-green-dark">Bonuses</BlockHeader>
				<BonusesEditor bonuses={bonusesLens.apply(documentState)} className="flex-grow" />
				<BlockHeader className="theme-green-dark">Feature List</BlockHeader>
				<DynamicList dynamicList={dynamicListLens.apply(documentState)} />
				<BlockHeader className="theme-green-dark">Auras</BlockHeader>
				<AurasEditor auras={aurasLens.apply(documentState)} />
				<BlockHeader className="theme-green-dark">Triggered Effects</BlockHeader>
				{/* <TriggeredEffectsEditor triggeredEffects={triggeredEffectsLens.apply(documentState)} /> */}
			</TabbedSheet.Tab>
			<TabbedSheet.Tab name="pools" label="Resources">
				<PoolBonusEditor pools={grantedPoolBonusesLens.apply(documentState)} />
				<PoolsEditor pools={grantedPoolsLens.apply(documentState)} className="flex-grow" />
			</TabbedSheet.Tab>
			{item.items.contents.filter((item) => item.type !== 'equipment').length ? (
				<TabbedSheet.Tab name="features" label="Features">
					<FeaturesList items={item.items.contents} />
				</TabbedSheet.Tab>
			) : null}
		</TabbedSheet>
	);
}
