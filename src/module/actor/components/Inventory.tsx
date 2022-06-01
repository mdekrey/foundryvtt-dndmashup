import { groupBy } from 'lodash/fp';
import classNames from 'classnames';
import { IconButton } from 'src/components/icon-button';
import { MashupItem, SpecificEquipmentItem } from 'src/module/item/mashup-item';
import { SpecificActor } from '../mashup-actor';
import { ItemSlot, itemSlots } from 'src/module/item/subtypes/equipment/item-slots';

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
					<table className="w-full border-collapse" key={slot}>
						<thead className="bg-theme text-white">
							<tr>
								<th className="text-left">{itemSlots[slot].display} Name</th>
								<th>Weight (lbs.)</th>
								<th />
							</tr>
						</thead>
						<tbody>
							{inventoryBySlots[slot].filter(isEquipment).map((item) => (
								<tr
									key={item.id}
									className={classNames(
										'even:bg-gradient-to-r from-transparent to-white odd:bg-transparent',
										'border-b-2 border-transparent'
									)}>
									<td>{item.name}</td>
									<td className="text-center">{item.data.data.weight}</td>
									<td className="text-right">
										<IconButton title="Equip" iconClassName="fas fa-shield-alt" />
										<IconButton title="Edit" onClick={edit(item)} iconClassName="fas fa-edit" />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : null
			)}
		</>
	);

	function edit(item: SpecificEquipmentItem) {
		return () => {
			item.sheet?.render(true, { focus: true });
		};
	}
}
