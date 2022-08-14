import { useState } from 'react';
import { FormInput, TabbedSheet } from '@foundryvtt-dndmashup/components';
import { Bonuses } from '../../../../bonuses';
import { Description } from '../../components/Description';
import { getItemSlotInfo, ItemSlot, itemSlots, ItemSlotTemplate } from './item-slots';
import { getEquipmentProperties } from './getEquipmentProperties';
import { Contents } from '../../components/Contents';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { EquipmentData, EquipmentDocument } from './dataSourceData';
import { documentAsState, SimpleDocumentData } from '@foundryvtt-dndmashup/foundry-compat';
import { OtherDetails } from './item-slots/other/details';

const itemSlotOptions = Object.entries(itemSlots).map(([key, { optionLabel: label }]) => ({
	value: key as ItemSlot,
	key,
	label,
	typeaheadLabel: label,
}));

export function EquipmentSheet<T extends ItemSlot = ItemSlot>({ item }: { item: EquipmentDocument<T> }) {
	const documentState = documentAsState(item, { deleteData: true });
	const [activeTab, setActiveTab] = useState('description');
	const {
		buildSummary: Summary,
		details: Details,
		additionalTabs,
		defaultEquipmentInfo,
	} = getItemSlotInfo<T>(item.data.data.itemSlot);

	const baseLens = Lens.identity<SimpleDocumentData<EquipmentData<T>>>();
	const imageLens = baseLens.toField('img');
	const dataLens = baseLens.toField('data');
	const bonusesLens = dataLens.toField('grantedBonuses');
	const equipmentPropertiesState: Stateful<ItemSlotTemplate<T>> = dataLens
		.toField('equipmentProperties')
		.default(defaultEquipmentInfo as never)
		.apply(documentState) as never;

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
		<TabbedSheet
			img={imageLens.apply(documentState)}
			name={item.name}
			headerSection={
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
					<FormInput.Inline className="col-span-12">
						<FormInput.Checkbox {...baseLens.toField('data').toField('container').apply(documentState)} />
						Is Container?
					</FormInput.Inline>

					<p className="col-span-12 text-xs">
						<Summary equipmentProperties={getEquipmentProperties<T>(item.data)} />
					</p>
				</div>
			}
			tabState={{ activeTab, setActiveTab }}>
			<TabbedSheet.Tab name="details" label="Details">
				<div className="grid grid-cols-12 gap-x-1 items-end">
					<Details itemState={equipmentPropertiesState} />
					<OtherDetails itemState={dataLens.apply(documentState)} />
				</div>
			</TabbedSheet.Tab>
			<TabbedSheet.Tab name="description" label="Description">
				<Description {...dataLens.toField('description').apply(documentState)} isEditor={item.isOwner} />
			</TabbedSheet.Tab>
			<TabbedSheet.Tab name="bonuses" label="Bonuses">
				<Bonuses bonuses={bonusesLens.apply(documentState)} className="flex-grow" />
			</TabbedSheet.Tab>
			{item.data.data.container ? (
				<TabbedSheet.Tab name="contents" label="Contents">
					<Contents item={item} />
				</TabbedSheet.Tab>
			) : null}
			{additionalTabs?.(equipmentPropertiesState)}
		</TabbedSheet>
	);
}
