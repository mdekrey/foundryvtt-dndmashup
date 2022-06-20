import { ImageButton } from 'src/components/image-button';
import { ItemTable } from 'src/components/ItemTable';
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
				<ItemTable key={key} items={items} title={label} className={className} header={PowerHeader} body={PowerBody} />
			))}
			{other.length ? <ItemTable items={other} title="Other Power" header={PowerHeader} body={PowerBody} /> : null}
		</>
	);
}

function PowerHeader() {
	return <th className="text-right"></th>;
}

function PowerBody({ item }: { item: MashupPower }) {
	return (
		<td className="text-right">
			<ImageButton src="/icons/svg/d20-black.svg" />
		</td>
	);
}
