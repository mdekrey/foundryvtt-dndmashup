import produce from 'immer';
import { FormInput } from 'src/components/form-input';
import { ImageEditor } from 'src/components/image-editor';
import { SourceDataOf } from 'src/core/foundry';
import { Bonuses } from '../components/bonuses';
import { Description } from '../components/Description';
import { ItemSlot, itemSlots, ItemSlotTemplates } from '../item-slots';
import { SpecificEquipmentItem } from '../mashup-item';

const itemSlotOptions = Object.entries(itemSlots).map(([key, { label }]) => ({ value: key, key, label }));

export function EquipmentSheet({ item }: { item: SpecificEquipmentItem }) {
	const equipmentProperties =
		item.data.data.equipmentProperties ??
		({
			...itemSlots[item.data.data.itemSlot].defaultEquipmentInfo,
		} as ItemSlotTemplates[keyof ItemSlotTemplates]);

	const itemSlotInfo = item.itemSlotInfo;
	const summary = itemSlotInfo.buildSummary ? itemSlotInfo.buildSummary(equipmentProperties) : `TODO: summary`;
	const Details = itemSlotInfo.details;

	function onChangeItemSlot(itemSlot: ItemSlot) {
		const result = produce<SourceDataOf<SpecificEquipmentItem>>((draft) => {
			draft.data.itemSlot = itemSlot;
			draft.data.equipmentProperties = {
				...itemSlots[itemSlot].defaultEquipmentInfo,
			} as ItemSlotTemplates[keyof ItemSlotTemplates];
			Object.keys(draft)
				.filter((k) => k !== 'data')
				.forEach((k) => {
					delete (draft as never)[k];
				});
		})(item.data._source);
		item.update({ ...result }, { overwrite: true, diff: false, recursive: false });
	}

	return (
		<div className="h-full flex flex-col gap-1">
			<div className="flex flex-row gap-1">
				<ImageEditor document={item} field="img" title={item.name} className="w-24 h-24 border-2 border-black p-px" />
				<div className="grid grid-cols-12 gap-x-1 items-end">
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

					<p className="col-span-12">{summary}</p>
				</div>
			</div>
			<div className="border-b border-black"></div>
			<nav data-group="primary" className="flex justify-around border-b border-black">
				<label data-tab="details" className="link uppecase">
					Details
				</label>
				<label data-tab="description" className="link uppecase">
					Description
				</label>
				<label data-tab="bonuses" className="link uppecase">
					Bonuses
				</label>
			</nav>

			<section className="flex-grow" data-tab-section>
				<div className="tab w-full h-full" data-group="primary" data-tab="details">
					<div className="grid grid-cols-12 gap-x-1 items-end">
						<Details item={item} />
					</div>
				</div>
				<div className="tab w-full h-full" data-group="primary" data-tab="description">
					<Description item={item} />
				</div>
				<div className="tab w-full h-full" data-group="primary" data-tab="bonuses">
					<Bonuses document={item} field="data.grantedBonuses" className="flex-grow" />
				</div>
			</section>
		</div>
	);
}
