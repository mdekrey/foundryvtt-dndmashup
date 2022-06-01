import classNames from 'classnames';
import { useState } from 'react';
import { FormInput } from 'src/components/form-input';
import { ImageEditor } from 'src/components/image-editor';
import { Bonuses } from '../components/bonuses';
import { Description } from '../components/Description';
import { ItemSlot, itemSlots, ItemSlotTemplates } from '../subtypes/equipment/item-slots';
import { SpecificEquipmentItem } from '../mashup-item';
import { deepUpdate } from 'src/core/foundry';

const itemSlotOptions = Object.entries(itemSlots).map(([key, { optionLabel: label }]) => ({ value: key, key, label }));

export function EquipmentSheet({ item }: { item: SpecificEquipmentItem }) {
	const [activeTab, setActiveTab] = useState('description');
	const equipmentProperties =
		item.data.data.equipmentProperties ??
		({
			...itemSlots[item.data.data.itemSlot].defaultEquipmentInfo,
		} as ItemSlotTemplates[keyof ItemSlotTemplates]);

	const itemSlotInfo = item.itemSlotInfo;
	const Summary = itemSlotInfo.buildSummary;
	const Details = itemSlotInfo.details;

	function onChangeItemSlot(itemSlot: ItemSlot) {
		deepUpdate(item, (draft) => {
			draft.data.itemSlot = itemSlot;
			draft.data.equipmentProperties = {
				...itemSlots[itemSlot].defaultEquipmentInfo,
			} as ItemSlotTemplates[keyof ItemSlotTemplates];
		});
		setActiveTab('details');
	}

	function activateTab(tab: string) {
		return () => setActiveTab(tab);
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
							onChange={(ev) => onChangeItemSlot(ev.target.value as ItemSlot)}
						/>
						<FormInput.Label className="text-sm">Item Slot</FormInput.Label>
					</FormInput>

					<p className="col-span-12">
						<Summary item={item} equipmentProperties={equipmentProperties} />
					</p>
				</div>
			</div>
			<div className="border-b border-black"></div>
			<nav className="flex justify-around border-b border-black">
				<button
					onClick={activateTab('details')}
					className={classNames('link uppercase', { 'font-bold': activeTab === 'details' })}>
					Details
				</button>
				<button
					onClick={activateTab('description')}
					className={classNames('link uppercase', { 'font-bold': activeTab === 'description' })}>
					Description
				</button>
				<button
					onClick={activateTab('bonuses')}
					className={classNames('link uppercase', { 'font-bold': activeTab === 'bonuses' })}>
					Bonuses
				</button>
			</nav>

			<section className="flex-grow">
				{activeTab === 'details' ? (
					<div className="w-full h-full">
						<div className="grid grid-cols-12 gap-x-1 items-end">
							<Details item={item} equipmentProperties={equipmentProperties} />
						</div>
					</div>
				) : activeTab === 'description' ? (
					<div className="w-full h-full">
						<Description item={item} />
					</div>
				) : activeTab === 'bonuses' ? (
					<div className="w-full h-full">
						<Bonuses document={item} field="data.grantedBonuses" className="flex-grow" />
					</div>
				) : null}
			</section>
		</div>
	);
}
