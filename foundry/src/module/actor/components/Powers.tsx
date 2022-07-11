import { ImageButton } from 'src/components/image-button';
import { ItemTable } from 'src/components/ItemTable';
import { powerChatMessage } from 'src/module/chat/power';
import { PowerPreview } from 'src/module/item/subtypes/power/components/PowerPreview';
import { MashupPower } from 'src/module/item/subtypes/power/config';
import { SpecificActor } from '../mashup-actor';

const powerGroups: {
	key: React.Key;
	label: string;
	className?: string;
	filter: (item: MashupPower) => boolean;
}[] = [
	{
		key: 'at-will-power',
		label: 'At-Will Power',
		className: 'theme-green-dark',
		filter: (item) => item.data.data.usage === 'at-will',
	},
	{
		key: 'encounter-power',
		label: 'Encounter Power',
		className: 'theme-red-dark',
		filter: (item) => item.data.data.usage === 'encounter',
	},
	{
		key: 'daily-power',
		label: 'Daily Power',
		className: 'theme-gray-dark',
		filter: (item) => item.data.data.usage === 'daily',
	},
];

export function Powers({ actor }: { actor: SpecificActor }) {
	const powers = actor.allPowers();
	const groups = powerGroups
		.map(({ filter, ...others }) => ({
			...others,
			items: powers.filter(filter),
		}))
		.filter(({ items }) => items.length > 0);
	const other = powers.filter((item) => !powerGroups.some(({ filter }) => filter(item)));
	return (
		<>
			{groups.map(({ key, label, items, className }) => (
				<ItemTable
					key={key}
					items={items}
					title={label}
					className={className}
					passedProps={{ actor }}
					header={PowerHeader}
					body={PowerBody}
					detail={PowerDetail}
					addedCellCount={1}
				/>
			))}
			{other.length ? (
				<ItemTable
					items={other}
					title="Other Power"
					passedProps={{ actor }}
					header={PowerHeader}
					body={PowerBody}
					detail={PowerDetail}
					addedCellCount={1}
				/>
			) : null}
		</>
	);
}

function PowerHeader() {
	return <th className="text-right"></th>;
}

function PowerBody({ item, actor }: { item: MashupPower; actor: SpecificActor }) {
	return (
		<td className="text-right">
			<ImageButton src="/icons/svg/d20-black.svg" onClick={shareToChat} />
		</td>
	);

	async function shareToChat() {
		await powerChatMessage(actor, item);
	}
}

function PowerDetail({ item }: { item: MashupPower }) {
	return (
		<div>
			<div className="max-w-md mx-auto border-4 border-white">
				<PowerPreview item={item} />
			</div>
		</div>
	);
}
