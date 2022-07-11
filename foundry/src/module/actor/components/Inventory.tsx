import { groupBy } from 'lodash/fp';
import classNames from 'classnames';
import { IconButton } from 'src/components/icon-button';
import { SpecificActor } from '../mashup-actor';
import {
	EquippedItemSlot,
	equippedItemSlots,
	getItemSlotInfo,
	ItemSlot,
	itemSlots,
} from 'src/module/item/subtypes/equipment/item-slots';
import { MashupItemEquipment } from 'src/module/item/subtypes/equipment';
import { isEquipment } from 'src/module/item/subtypes/equipment/isEquipment';
import { ItemTable } from 'src/components/ItemTable';
import { useCallback } from 'react';
import { getEquipmentProperties } from 'src/module/item/subtypes/equipment/getEquipmentProperties';
import { SimpleDocumentData } from 'src/core/interfaces/simple-document';
import { EquipmentData } from 'src/module/item/subtypes/equipment/dataSourceData';

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
					<InventorySlotTable
						items={inventoryBySlots[slot]}
						key={slot}
						slot={slot}
						onEquip={actor.isOwner ? (item, equipSlot) => equip(item.data._source, equipSlot) : undefined}
					/>
				) : null
			)}
		</>
	);

	function equip(itemData: SimpleDocumentData<EquipmentData>, equipSlot: EquippedItemSlot) {
		const { equippedSlots, slotsNeeded } = getItemSlotInfo(itemData.data.itemSlot);

		const wasEquipped = itemData.data.equipped && itemData.data.equipped[0] === equipSlot;
		const next = wasEquipped ? [] : [equipSlot];
		if (!wasEquipped && slotsNeeded(getEquipmentProperties(itemData)) > 1) {
			next.push(...equippedSlots.filter((e) => e !== equipSlot));
		}
		const unequip = actor.data.items.contents
			.filter(isEquipment)
			.filter(
				(eq) => eq.id !== itemData._id && eq.data.data.equipped && next.some((p) => eq.data.data.equipped.includes(p))
			);

		actor.updateEmbeddedDocuments('Item', [
			{ _id: itemData._id, data: { equipped: next } },
			...unequip.map(({ id }) => ({ _id: id, data: { equipped: [] } })),
		]);
	}
}

function InventorySlotTable<T extends ItemSlot>({
	items,
	slot,
	onEquip,
}: {
	items: MashupItemEquipment<T>[];
	slot: T;
	onEquip?: (item: MashupItemEquipment<T>, equipSlot: EquippedItemSlot) => void;
}) {
	const itemSlotInfo = itemSlots[slot];
	const {
		inventoryTableHeader: TableHeader,
		inventoryTableBody: TableBody,
		inventoryTableAddedCellCount,
		equippedSlots,
	} = itemSlotInfo;

	const canEquip = equippedSlots.length;

	const InventorySlotHeader = useCallback(
		() => (
			<>
				<TableHeader />
				{canEquip ? <th className="w-12">Equip</th> : null}
			</>
		),
		[TableHeader, equippedSlots]
	);

	const InventorySlotBody = useCallback<React.FC<{ item: MashupItemEquipment<T> }>>(
		({ item }) => (
			<>
				<TableBody equipmentProperties={getEquipmentProperties<T>(item.data)} />
				{canEquip ? (
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
								onClick={onEquip && (() => onEquip(item, equipSlot))}
							/>
						))}
					</td>
				) : null}
			</>
		),
		[TableBody, equippedSlots]
	);

	const addedCellCount = inventoryTableAddedCellCount + canEquip ? 1 : 0;

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
