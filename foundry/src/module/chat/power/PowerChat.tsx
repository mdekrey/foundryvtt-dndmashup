import { intersection } from 'lodash/fp';
import { useState } from 'react';
import { Select, SelectItem } from 'dndmashup-react/src/components/form-input/select';
import { SpecificActor } from 'src/module/actor/mashup-actor';
import { isEquipment } from 'dndmashup-react/src/module/item/subtypes/equipment/isEquipment';
import { EquippedItemSlot } from 'dndmashup-react/src/module/item/subtypes/equipment/item-slots';
import { PowerPreview } from 'dndmashup-react/src/module/item/subtypes/power/components/PowerPreview';
import { PowerDialog } from './PowerDialog';
import { PowerDocument } from 'dndmashup-react/src/module/item/subtypes/power/dataSourceData';
import { EquipmentDocument } from 'dndmashup-react/src/module/item/subtypes/equipment/dataSourceData';
import { ItemDocument } from 'dndmashup-react/src/module/item';

export function PowerChat({ item, actor }: { item: PowerDocument; actor: SpecificActor }) {
	return (
		<div className="flex flex-col items-center">
			<div className="max-w-sm mx-auto border-4 border-white">
				<PowerPreview item={item} />
			</div>
			{actor.isOwner ? (
				<>
					<hr className="border-b border-black w-full my-1" />
					<PowerOptions power={item} actor={actor} />
				</>
			) : null}
		</div>
	);
}

const toolKeywords = ['weapon', 'implement'] as const;
const heldSlots: EquippedItemSlot[] = ['primary-hand', 'off-hand'];
function PowerOptions({ power, actor }: { power: PowerDocument; actor: SpecificActor }) {
	const toolType =
		(intersection(toolKeywords, power.data.data.keywords)[0] as typeof toolKeywords[number] | undefined) ?? null;
	const usesTool = toolType !== null;
	const [tool, setTool] = useState<EquipmentDocument<'weapon' | 'implement'> | null>(null);
	const possibleTools = (actor.items.contents as ItemDocument[])
		.filter(isEquipment)
		.filter((eq) => eq.data.data.equipped.some((slot) => heldSlots.includes(slot)))
		.filter((heldItem) => heldItem.data.data.itemSlot === toolType) as EquipmentDocument<'weapon' | 'implement'>[];

	return (
		<>
			{usesTool ? <ItemSelector items={possibleTools} item={tool ?? possibleTools[0]} onChange={setTool} /> : null}
			<button onClick={onRoll}>Roll me</button>
			<button onClick={onDemo}>Demo</button>
		</>
	);

	function onRoll() {
		PowerDialog.create(power, actor).catch();
	}

	async function onDemo() {
		const roll = Roll.fromTerms([
			new Die({ number: 1, faces: 20 }),
			new OperatorTerm({ operator: '+' }),
			new NumericTerm({ number: 2, options: { flavor: 'ability bonus' } }),
			new OperatorTerm({ operator: '+' }),
			new NumericTerm({ number: 4, options: { flavor: 'power bonus' } }),
			new OperatorTerm({ operator: '+' }),
			new NumericTerm({ number: 2, options: { flavor: 'bonus' } }),
		]);
		await roll.evaluate();
		const json = roll.toJSON();
		console.log(roll, json);
		await roll.toMessage();
	}
}

function ItemSelector<T extends ItemDocument>({
	items,
	item,
	onChange,
}: {
	items: T[];
	item: T;
	onChange: (selectedItem: T) => void;
}) {
	const options = items.map(
		(item): SelectItem<T> => ({
			key: item.id ?? '',
			typeaheadLabel: item.name ?? '',
			value: item,
			label: (
				<>
					{item.img ? <img src={item.img} alt="" className="w-8 h-8 inline-block" /> : null} {item.name}
				</>
			),
		})
	);
	return <Select value={item} options={options} onChange={onChange} className="h-9 pb-1" />;
}
