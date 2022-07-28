import { intersection } from 'lodash/fp';
import { useState } from 'react';
import { ChatButton, FormInput, SelectItem } from '@foundryvtt-dndmashup/components';
import { SpecificActor } from '../../../module/actor/mashup-actor';
import { isEquipment, PowerEffect } from '@foundryvtt-dndmashup/mashup-react';
import { EquippedItemSlot } from '@foundryvtt-dndmashup/mashup-react';
import { PowerPreview } from '@foundryvtt-dndmashup/mashup-react';
import { PowerDialog } from './PowerDialog';
import { PowerDocument } from '@foundryvtt-dndmashup/mashup-react';
import { EquipmentDocument } from '@foundryvtt-dndmashup/mashup-react';
import { ItemDocument } from '@foundryvtt-dndmashup/mashup-react';
import classNames from 'classnames';
import { PowerEffectTemplate } from '../../power-effect-template';

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

	console.log(power.data.data.effects);

	return (
		<>
			{usesTool ? <ItemSelector items={possibleTools} item={tool ?? possibleTools[0]} onChange={setTool} /> : null}
			{power.data.data.effects.filter(hasEffectInfo).map((effect, index) => (
				<PowerEffectOptions key={index} effect={effect} actor={actor} />
			))}
			<button onClick={onRoll}>Dialog</button>
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

function hasEffectInfo(effect: PowerEffect): boolean {
	return Boolean(
		effect.attackRoll ||
			effect.hit.damage ||
			effect.hit.healing ||
			effect.miss?.damage ||
			effect.miss?.healing ||
			effect.typeAndRange.type === 'close' ||
			effect.typeAndRange.type === 'area' ||
			effect.typeAndRange.type === 'within'
	);
}
function PowerEffectOptions({ effect, actor }: { effect: PowerEffect; actor: SpecificActor }) {
	return (
		<div
			className={classNames('grid grid-cols-1 w-full gap-1 mt-1', {
				'pt-1': effect.name,
			})}>
			{effect.name && <p className="bg-theme text-white px-2 font-bold text-center py-1">{effect.name}</p>}

			{PowerEffectTemplate.canCreate(effect.typeAndRange) ? (
				<ChatButton className="mx-2" onClick={createEffect}>
					Place Template
				</ChatButton>
			) : null}
			{effect.attackRoll && <ChatButton className="mx-2">Roll Attack</ChatButton>}
			{effect.hit.damage && <ChatButton className="mx-2">Hit Damage</ChatButton>}
			{effect.hit.healing && <ChatButton className="mx-2">Hit Healing</ChatButton>}
			{effect.miss?.damage && <ChatButton className="mx-2">Miss Damage</ChatButton>}
			{effect.miss?.healing && <ChatButton className="mx-2">Miss Healing</ChatButton>}
		</div>
	);

	function createEffect() {
		const template = PowerEffectTemplate.fromTypeAndRange(effect.typeAndRange, actor.data.data.size);
		if (actor && actor.sheet) actor.sheet.minimize();
		if (template)
			template.drawPreview(() => {
				if (actor && actor.sheet) actor.sheet.maximize();
			});
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
	return <FormInput.Select value={item} options={options} onChange={onChange} className="h-9 pb-1" />;
}
