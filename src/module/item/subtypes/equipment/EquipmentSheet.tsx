import { useState } from 'react';
import { FormInput } from 'src/components/form-input';
import { ImageEditor } from 'src/components/image-editor';
import { Bonuses } from 'src/module/bonuses';
import { Description } from '../../components/Description';
import { ItemSlot, itemSlots, ItemSlotTemplates } from './item-slots';
import { deepUpdate } from 'src/core/foundry';
import { Tabs } from 'src/components/tab-section';
import { MashupItemEquipment } from '.';

const itemSlotOptions = Object.entries(itemSlots).map(([key, { optionLabel: label }]) => ({ value: key, key, label }));

export function EquipmentSheet<T extends ItemSlot = ItemSlot>({ item }: { item: MashupItemEquipment<T> }) {
	const [activeTab, setActiveTab] = useState('description');
	const { buildSummary: Summary, details: Details } = item.itemSlotInfo;

	function onChangeItemSlot(itemSlot: ItemSlot) {
		deepUpdate(item as unknown as MashupItemEquipment<ItemSlot>, (draft) => {
			draft.data.itemSlot = itemSlot;
			draft.data.equipmentProperties = {
				...itemSlots[itemSlot].defaultEquipmentInfo,
			} as ItemSlotTemplates[keyof ItemSlotTemplates];
		});
		setActiveTab('details');
	}

	return (
		<div className="h-full flex flex-col gap-1">
			<div className="flex flex-row gap-1">
				<ImageEditor document={item} field="img" title={item.name} className="w-24 h-24 border-2 border-black p-px" />
				<div className="grid grid-cols-12 gap-x-1 items-end flex-grow">
					<FormInput className="col-span-9">
						<FormInput.AutoTextField document={item} field="name" className="text-lg" />
						<FormInput.Label>Item Name</FormInput.Label>
					</FormInput>
					<FormInput className="col-span-3">
						<FormInput.Select
							className="text-lg text-center"
							options={itemSlotOptions}
							value={item.data.data.itemSlot}
							onChange={item.isOwner ? (ev) => onChangeItemSlot(ev.target.value as ItemSlot) : undefined}
						/>
						<FormInput.Label className="text-sm">Item Slot</FormInput.Label>
					</FormInput>

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
				</section>
			</Tabs.Controlled>
		</div>
	);
}
