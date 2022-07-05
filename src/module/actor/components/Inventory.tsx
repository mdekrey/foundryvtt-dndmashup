import { groupBy } from 'lodash/fp';
import classNames from 'classnames';
import { IconButton } from 'src/components/icon-button';
import { SpecificActor } from '../mashup-actor';
import {
	EquippedItemSlot,
	equippedItemSlots,
	ItemSlot,
	itemSlots,
} from 'src/module/item/subtypes/equipment/item-slots';
import { MashupItemEquipment } from 'src/module/item/subtypes/equipment';
import { isEquipment } from 'src/module/item/subtypes';
import { ItemTable } from 'src/components/ItemTable';
import { useCallback } from 'react';

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
	items: MashupItemEquipment<T>[];
	slot: T;
}) {
	const itemSlotInfo = itemSlots[slot];
	const {
		inventoryTableHeader: TableHeader,
		inventoryTableBody: TableBody,
		inventoryTableAddedCellCount,
		equippedSlots,
	} = itemSlotInfo;

	const InventorySlotHeader = useCallback(
		() => (
			<>
				<TableHeader />
				{equippedSlots.length ? <th className="w-12">Equip</th> : null}
			</>
		),
		[TableHeader, equippedSlots]
	);

	const InventorySlotBody = useCallback<React.FC<{ item: MashupItemEquipment<T> }>>(
		({ item }) => (
			<>
				<TableBody equipmentProperties={item.equipmentProperties} />
				{equippedSlots.length ? (
					<td className="text-center w-12">
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
								onClick={item.isOwner ? () => equip(actor, item, equipSlot) : undefined}
							/>
						))}
					</td>
				) : null}
			</>
		),
		[actor, TableBody, equippedSlots]
	);

	const addedCellCount = inventoryTableAddedCellCount + equippedSlots.length ? 1 : 0;

	return (
		<ItemTable
			items={items}
			title={itemSlots[slot].display}
			header={InventorySlotHeader}
			body={InventorySlotBody}
			addedCellCount={addedCellCount}
		/>
	);
}

function equip<T extends ItemSlot>(actor: SpecificActor, item: MashupItemEquipment<T>, equipSlot: EquippedItemSlot) {
	const { equippedSlots, slotsNeeded } = item.itemSlotInfo;

	const wasEquipped = item.data.data.equipped && item.data.data.equipped[0] === equipSlot;
	const next = wasEquipped ? [] : [equipSlot];
	if (!wasEquipped && slotsNeeded(item) > 1) {
		next.push(...equippedSlots.filter((e) => e !== equipSlot));
	}
	const unequip = actor.data.items.contents
		.filter(isEquipment)
		.filter((eq) => eq.id !== item.id && eq.data.data.equipped && next.some((p) => eq.data.data.equipped.includes(p)));
	console.log(wasEquipped, next, unequip);
	actor.updateEmbeddedDocuments(item.documentName, [
		{ _id: item.id, data: { equipped: next } },
		...unequip.map(({ id }) => ({ _id: id, data: { equipped: [] } })),
	]);
}
