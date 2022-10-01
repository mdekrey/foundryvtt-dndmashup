import { groupBy } from 'lodash/fp';
import classNames from 'classnames';
import { AppButton, IconButton, Table } from '@foundryvtt-dndmashup/components';
import { EquippedItemSlot, equippedItemSlots, ItemSlot, itemSlots } from '../../item/subtypes/equipment/item-slots';
import { isEquipment } from '../../item/subtypes/equipment/isEquipment';
import { ItemTable } from '@foundryvtt-dndmashup/foundry-compat';
import { getEquipmentProperties } from '../../item/subtypes/equipment/getEquipmentProperties';
import { SimpleDocumentData } from '@foundryvtt-dndmashup/foundry-compat';
import { EquipmentData, EquipmentDocument } from '../../item/subtypes/equipment/dataSourceData';
import { ActorDocument } from '../documentType';
import { useChatMessageDispatcher } from '../../chat';

export const orderedItemSlots: ItemSlot[] = [
	'weapon',
	'implement',
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

export function Inventory({ actor }: { actor: ActorDocument }) {
	const inventoryBySlots = groupBy(
		(i) => i.system.itemSlot,
		actor.items.contents.filter<EquipmentDocument>(isEquipment)
	);
	return (
		<>
			{orderedItemSlots.some((slot) => !!inventoryBySlots[slot]) ? (
				orderedItemSlots.map((slot) =>
					inventoryBySlots[slot] ? (
						<InventorySlotTable
							actor={actor}
							items={inventoryBySlots[slot]}
							key={slot}
							slot={slot}
							onEquip={actor.isOwner ? (item, equipSlot) => equip(item._source, equipSlot) : undefined}
						/>
					) : null
				)
			) : (
				<Table className="theme-orange-dark">
					<Table.HeaderRow>
						<th>No Inventory Items Found</th>
					</Table.HeaderRow>
					<Table.Body>
						<tr>
							<td className="text-center">Drag-and-drop items onto this sheet to add them</td>
						</tr>
					</Table.Body>
				</Table>
			)}
		</>
	);

	function equip(itemData: SimpleDocumentData<EquipmentData>, equipSlot: EquippedItemSlot) {
		actor.equip(itemData, equipSlot);
	}
}

function InventorySlotTable<T extends ItemSlot>({
	actor,
	items,
	slot,
	onEquip,
}: {
	actor: ActorDocument;
	items: EquipmentDocument<T>[];
	slot: T;
	onEquip?: (item: EquipmentDocument<T>, equipSlot: EquippedItemSlot) => void;
}) {
	const dispatch = useChatMessageDispatcher();
	const itemSlotInfo = itemSlots[slot];
	const { inventoryTableHeader: TableHeader, inventoryTableBody: TableBody, equippedSlots } = itemSlotInfo;

	const canEquip = equippedSlots.length;

	return (
		<ItemTable
			className="theme-orange-dark"
			items={items}
			title={itemSlots[slot].display}
			header={() => (
				<>
					<TableHeader />
					{canEquip ? <th className="w-12">Equip</th> : null}
					<th className="w-6">
						<AppButton className="border-0" onClick={() => actor.importChildItem('equipment')}>
							New
						</AppButton>
					</th>
				</>
			)}
			body={(item) => (
				<>
					<TableBody equipmentProperties={getEquipmentProperties<T>(item._source)} />
					{canEquip ? (
						<td className="text-center w-12">
							{equippedSlots.map((equipSlot) => (
								<IconButton
									key={equipSlot}
									title={`Equip ${equippedItemSlots[equipSlot].label}`}
									className={classNames({
										'opacity-25': item.system.equipped && item.system.equipped.indexOf(equipSlot) === -1,
										// fade out opposite hand
										'opacity-50': item.system.equipped && item.system.equipped.indexOf(equipSlot) >= 1,
									})}
									iconClassName="fas fa-shield-alt"
									onClick={onEquip && (() => onEquip(item, equipSlot))}
								/>
							))}
						</td>
					) : null}
					<td>
						<IconButton title={`Share to Chat`} iconClassName="fas fa-comments" onClick={() => shareToChat(item)} />
					</td>
				</>
			)}
		/>
	);
	async function shareToChat(item: EquipmentDocument) {
		dispatch.sendChatMessage('share', actor, { item });
	}
}
