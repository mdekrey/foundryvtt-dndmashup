import { groupBy } from 'lodash/fp';
import classNames from 'classnames';
import { IconButton } from 'src/components/icon-button';
import { MashupItem, SpecificEquipmentItem } from 'src/module/item/mashup-item';
import { SpecificActor } from '../mashup-actor';
import {
	EquippedItemSlot,
	equippedItemSlots,
	ItemSlot,
	itemSlots,
} from 'src/module/item/subtypes/equipment/item-slots';

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
				inventoryBySlots[slot] ? (
					<InventorySlotTable actor={actor} items={inventoryBySlots[slot]} key={slot} slot={slot} />
				) : null
			)}
		</>
	);
}

function InventorySlotTable<T extends ItemSlot>({
	actor,
	items,
	slot,
}: {
	actor: SpecificActor;
	items: SpecificEquipmentItem<T>[];
	slot: T;
}) {
	const itemSlotInfo = itemSlots[slot];
	const { inventoryTableHeader: TableHeader, inventoryTableBody: TableBody, equippedSlots, slotsNeeded } = itemSlotInfo;

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
					const equipmentProperties = item.equipmentProperties;
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
											title={`Equip ${equippedItemSlots[equipSlot].label}`}
											className={classNames({
												'opacity-25': item.data.data.equipped && item.data.data.equipped.indexOf(equipSlot) === -1,
												// fade out opposite hand
												'opacity-50': item.data.data.equipped && item.data.data.equipped.indexOf(equipSlot) >= 1,
											})}
											iconClassName="fas fa-shield-alt"
											onClick={item.isOwner ? equip(equipSlot) : undefined}
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

					function equip(equipSlot: EquippedItemSlot) {
						return () => {
							const wasEquipped = item.data.data.equipped && item.data.data.equipped[0] === equipSlot;
							const next = wasEquipped ? [] : [equipSlot];
							if (!wasEquipped && slotsNeeded(item, equipmentProperties) > 1) {
								next.push(...equippedSlots.filter((e) => e !== equipSlot));
							}
							const unequip = actor.data.items.contents
								.filter(isEquipment)
								.filter(
									(eq) =>
										eq.id !== item.id && eq.data.data.equipped && next.some((p) => eq.data.data.equipped.includes(p))
								);
							console.log(wasEquipped, next, unequip);
							actor.updateEmbeddedDocuments(item.documentName, [
								{ _id: item.id, data: { equipped: next } },
								...unequip.map(({ id }) => ({ _id: id, data: { equipped: [] } })),
							]);
						};
					}
				})}
			</tbody>
		</table>
	);

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
