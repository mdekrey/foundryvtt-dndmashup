import { groupBy } from 'lodash/fp';
import classNames from 'classnames';
import { IconButton } from 'src/components/icon-button';
import { MashupItem, SpecificEquipmentItem } from 'src/module/item/mashup-item';
import { SpecificActor } from '../mashup-actor';
import { EquippedItemSlot, ItemSlot, itemSlots, ItemSlotTemplate } from 'src/module/item/subtypes/equipment/item-slots';

function isEquipment(item: MashupItem): item is SpecificEquipmentItem {
	return item.data.type === 'equipment';
}

export const orderedItemSlots: ItemSlot[] = [
	'weapon',
	'shield',
	'armor',
	'arms',
	'feet',
	'hands',
	'head',
	'neck',
	'ring',
	'waist',
	'',
];

export function Inventory({ actor }: { actor: SpecificActor }) {
	const inventoryBySlots = groupBy((i) => i.data.data.itemSlot, actor.items.contents.filter(isEquipment));
	return (
		<>
			{orderedItemSlots.map((slot) =>
				inventoryBySlots[slot] ? <InventorySlotTable items={inventoryBySlots[slot]} key={slot} slot={slot} /> : null
			)}
		</>
	);
}

function InventorySlotTable<T extends ItemSlot>({ items, slot }: { items: SpecificEquipmentItem<T>[]; slot: T }) {
	const itemSlotInfo = itemSlots[slot];
	const {
		inventoryTableHeader: TableHeader,
		inventoryTableBody: TableBody,
		defaultEquipmentInfo,
		equippedSlots,
	} = itemSlotInfo;

	return (
		<table className="w-full border-collapse">
			<thead className="bg-theme text-white">
				<tr>
					<th className="text-left">{itemSlots[slot].display} Name</th>
					<TableHeader />
					{equippedSlots.length ? <th className="w-16">Equipped</th> : null}
					<th className="w-16">Weight (lbs.)</th>
					<th className="w-16" />
				</tr>
			</thead>
			<tbody>
				{items.filter(isEquipment).map((item) => {
					const equipmentProperties = (item.data.data.equipmentProperties as ItemSlotTemplate<T>) ?? {
						...defaultEquipmentInfo,
					};
					return (
						<tr
							key={item.id}
							className={classNames(
								'even:bg-gradient-to-r from-transparent to-white odd:bg-transparent',
								'border-b-2 border-transparent'
							)}>
							<td>
								{item.img ? <img src={item.img} alt="" className="w-8 h-8 inline-block mr-1" /> : null} {item.name}
							</td>
							<TableBody item={item} equipmentProperties={equipmentProperties} />
							{equippedSlots.length ? (
								<td className="w-16">
									{equippedSlots.map((equipSlot) => (
										<IconButton
											key={equipSlot}
											title="Equip"
											className={classNames({ 'opacity-25': item.data.data.equipped !== equipSlot })}
											iconClassName="fas fa-shield-alt"
											onClick={item.isOwner ? equip(item, equipSlot) : undefined}
										/>
									))}
								</td>
							) : null}
							<td className="text-center w-16">{item.data.data.weight}</td>
							<td className="text-right w-16">
								{item.isOwner ? <IconButton title="Edit" onClick={edit(item)} iconClassName="fas fa-edit" /> : null}
								{item.isOwner ? (
									<IconButton title="Delete" onClick={remove(item)} iconClassName="fas fa-trash" />
								) : null}
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);

	function equip(item: SpecificEquipmentItem, equipSlot: EquippedItemSlot) {
		return () => {
			const next = item.data.data.equipped === equipSlot ? '' : equipSlot;
			// TODO: multiple hands
			item.update({ data: { equipped: next } });
		};
	}

	function edit(item: SpecificEquipmentItem) {
		return () => {
			item.sheet?.render(true, { focus: true });
		};
	}
	function remove(item: SpecificEquipmentItem) {
		return () => {
			item.delete();
		};
	}
}
