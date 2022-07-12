import { useState } from 'react';
import { FormInput } from 'src/components/form-input';
import { ImageEditor } from 'src/components/image-editor';
import { Bonuses } from 'src/module/bonuses';
import { Description } from '../../components/Description';
import { getItemSlotInfo, ItemSlot, itemSlots } from './item-slots';
import { Tabs } from 'src/components/tab-section';
import { getEquipmentProperties } from './getEquipmentProperties';
import { Contents } from '../../components/Contents';
import { FeaturesList } from '../../components/FeaturesList';
import { Lens } from 'dndmashup-react/core/lens';
import { documentAsState } from 'src/components/form-input/hooks/useDocumentAsState';
import { EquipmentData, EquipmentDocument } from './dataSourceData';
import { SimpleDocumentData } from 'dndmashup-react/core/interfaces/simple-document';

const itemSlotOptions = Object.entries(itemSlots).map(([key, { optionLabel: label }]) => ({
	value: key as ItemSlot,
	key,
	label,
	typeaheadLabel: label,
}));

export function EquipmentSheet<T extends ItemSlot = ItemSlot>({ item }: { item: EquipmentDocument<T> }) {
	const documentState = documentAsState(item, { deleteData: true });
	const [activeTab, setActiveTab] = useState('description');
	const { buildSummary: Summary, details: Details } = getItemSlotInfo<T>(item.data.data.itemSlot);

	const baseLens = Lens.identity<SimpleDocumentData<EquipmentData<T>>>();
	const imageLens = baseLens.toField('img');
	const dataLens = baseLens.toField('data');
	const bonusesLens = dataLens.toField('grantedBonuses');

	function onChangeItemSlot(itemSlot: React.SetStateAction<ItemSlot>) {
		documentState.onChangeValue((draft) => {
			draft.data.itemSlot = (typeof itemSlot === 'function' ? itemSlot(draft.data.itemSlot) : itemSlot) as never;
			draft.data.equipmentProperties = {
				...itemSlots[draft.data.itemSlot].defaultEquipmentInfo,
			} as never;
		});
		setActiveTab('details');
	}

	return (
		<div className="h-full flex flex-col gap-1">
			<div className="flex flex-row gap-1">
				<ImageEditor
					{...imageLens.apply(documentState)}
					title={item.name}
					className="w-24 h-24 border-2 border-black p-px"
				/>
				<div className="grid grid-cols-12 gap-x-1 items-end flex-grow">
					<FormInput className="col-span-9 text-lg">
						<FormInput.TextField {...baseLens.toField('name').apply(documentState)} />
						<FormInput.Label>Item Name</FormInput.Label>
					</FormInput>
					<FormInput className="col-span-3 text-lg">
						<FormInput.Select
							className="text-center"
							options={itemSlotOptions}
							value={item.data.data.itemSlot}
							onChange={item.isOwner ? onChangeItemSlot : undefined}
						/>
						<FormInput.Label className="text-sm">Item Slot</FormInput.Label>
					</FormInput>
					<p className="col-span-12">
						<FormInput.Inline>
							<FormInput.Checkbox {...baseLens.toField('data').toField('container').apply(documentState)} />
							Is Container?
						</FormInput.Inline>
					</p>

					<p className="col-span-12 text-xs">
						<Summary equipmentProperties={getEquipmentProperties<T>(item.data)} />
					</p>
				</div>
			</div>
			<div className="border-b border-black"></div>
			<Tabs.Controlled activeTab={activeTab} setActiveTab={setActiveTab}>
				<Tabs.Nav>
					<Tabs.NavButton tabName="details">Details</Tabs.NavButton>
					<Tabs.NavButton tabName="description">Description</Tabs.NavButton>
					<Tabs.NavButton tabName="bonuses">Bonuses</Tabs.NavButton>
					{item.items.contents.filter((item) => item.type !== 'equipment').length ? (
						<Tabs.NavButton tabName="features">Features</Tabs.NavButton>
					) : null}
					{item.data.data.container ? <Tabs.NavButton tabName="contents">Contents</Tabs.NavButton> : null}
				</Tabs.Nav>

				<section className="flex-grow">
					<Tabs.Tab tabName="details">
						<div className="grid grid-cols-12 gap-x-1 items-end">
							<Details itemState={documentState} />
						</div>
					</Tabs.Tab>
					<Tabs.Tab tabName="description">
						<Description {...dataLens.toField('description').apply(documentState)} isEditor={item.isOwner} />
					</Tabs.Tab>
					<Tabs.Tab tabName="bonuses">
						<Bonuses bonuses={bonusesLens.apply(documentState)} className="flex-grow" />
					</Tabs.Tab>
					<Tabs.Tab tabName="features">
						<FeaturesList items={item.items.contents} />
					</Tabs.Tab>
					<Tabs.Tab tabName="contents">
						<Contents item={item} />
					</Tabs.Tab>
				</section>
			</Tabs.Controlled>
		</div>
	);
}
