import { useState } from 'react';
import { FormInput, TabbedSheet } from '@foundryvtt-dndmashup/components';
import { BonusesEditor, DynamicList } from '@foundryvtt-dndmashup/mashup-rules';
import { Description } from '../../components/Description';
import { Lens } from '@foundryvtt-dndmashup/core';
import { SkillData, SkillDocument } from './dataSourceData';
import { documentAsState, SimpleDocumentData } from '@foundryvtt-dndmashup/foundry-compat';

export function SkillSheet({ item }: { item: SkillDocument }) {
	const documentState = documentAsState(item, { deleteData: true });
	const [activeTab, setActiveTab] = useState('description');

	const baseLens = Lens.identity<SimpleDocumentData<SkillData>>();
	const imageLens = baseLens.toField('img');
	const dataLens = baseLens.toField('data');
	const bonusesLens = dataLens.toField('grantedBonuses');
	const dynamicListLens = dataLens.toField('dynamicList');

	return (
		<TabbedSheet
			img={imageLens.apply(documentState)}
			name={item.name}
			headerSection={
				<div className="grid grid-cols-12 gap-x-1 items-end flex-grow">
					<FormInput className="col-span-9 text-lg">
						<FormInput.TextField {...baseLens.toField('name').apply(documentState)} />
						<FormInput.Label>Skill Name</FormInput.Label>
					</FormInput>
				</div>
			}
			tabState={{ activeTab, setActiveTab }}>
			<TabbedSheet.Tab name="description" label="Description">
				<Description {...dataLens.toField('description').apply(documentState)} isEditor={item.isOwner} />
			</TabbedSheet.Tab>
			<TabbedSheet.Tab name="bonuses" label="Bonuses">
				<BonusesEditor bonuses={bonusesLens.apply(documentState)} className="flex-grow" />
				<DynamicList dynamicList={dynamicListLens.apply(documentState)} />
			</TabbedSheet.Tab>
		</TabbedSheet>
	);
}
