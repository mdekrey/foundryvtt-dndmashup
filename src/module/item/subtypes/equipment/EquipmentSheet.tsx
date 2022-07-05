import { useState } from 'react';
import { FormInput } from 'src/components/form-input';
import { ImageEditor } from 'src/components/image-editor';
import { Bonuses } from 'src/module/bonuses';
import { Description } from '../../components/Description';
import { ItemSlot, itemSlots, ItemSlotTemplates } from './item-slots';
import { deepUpdate, SourceDataOf } from 'src/core/foundry';
import { Tabs } from 'src/components/tab-section';
import { MashupItemEquipment } from '.';
import { Contents } from '../../components/Contents';
import { FeaturesList } from '../../components/FeaturesList';
import { Lens } from 'src/core/lens';
import { documentAsState } from 'src/components/form-input/hooks/useDocumentAsState';

const itemSlotOptions = Object.entries(itemSlots).map(([key, { optionLabel: label }]) => ({
	value: key as ItemSlot,
	key,
	label,
	typeaheadLabel: label,
}));

export function EquipmentSheet<T extends ItemSlot = ItemSlot>({ item }: { item: MashupItemEquipment<T> }) {
	const documentState = documentAsState(item, { deleteData: true });
	const [activeTab, setActiveTab] = useState('description');
	const { buildSummary: Summary, details: Details } = item.itemSlotInfo;

	const baseLens = Lens.identity<SourceDataOf<MashupItemEquipment<T>>>();

	function onChangeItemSlot(itemSlot: React.SetStateAction<ItemSlot>) {
		deepUpdate(item as unknown as MashupItemEquipment<ItemSlot>, (draft) => {
			draft.data.itemSlot = typeof itemSlot === 'function' ? itemSlot(draft.data.itemSlot) : itemSlot;
			draft.data.equipmentProperties = {
				...itemSlots[draft.data.itemSlot].defaultEquipmentInfo,
			} as ItemSlotTemplates[keyof ItemSlotTemplates];
		});
		setActiveTab('details');
	}

	return (
		<div className="h-full flex flex-col gap-1">
			<div className="flex flex-row gap-1">
				<ImageEditor document={item} field="img" title={item.name} className="w-24 h-24 border-2 border-black p-px" />
				<div className="grid grid-cols-12 gap-x-1 items-end flex-grow text-lg">
					<FormInput className="col-span-9">
						<FormInput.TextField {...baseLens.toField('name').apply(documentState)} />
						<FormInput.Label>Item Name</FormInput.Label>
					</FormInput>
					<FormInput className="col-span-3">
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

					<p className="col-span-12">
						<Summary item={item} />
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
							<Details item={item} />
						</div>
					</Tabs.Tab>
					<Tabs.Tab tabName="description">
						<Description item={item} />
					</Tabs.Tab>
					<Tabs.Tab tabName="bonuses">
						<Bonuses document={item} field="data.grantedBonuses" className="flex-grow" />
					</Tabs.Tab>
					<Tabs.Tab tabName="features">
						<FeaturesList item={item} />
					</Tabs.Tab>
					<Tabs.Tab tabName="contents">
						<Contents item={item} />
					</Tabs.Tab>
				</section>
			</Tabs.Controlled>
		</div>
	);
}
