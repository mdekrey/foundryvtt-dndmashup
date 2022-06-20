import { isFeature } from 'src/module/item/subtypes';
import { MashupItemFeature } from 'src/module/item/subtypes/feature/config';
import { SpecificActor } from '../mashup-actor';
import { ItemTable } from 'src/components/ItemTable';
import { MashupItemBase } from 'src/module/item/mashup-item';

const features: {
	key: React.Key;
	label: string;
	filter: (item: MashupItemBase) => boolean;
	header?: React.FC;
	body?: React.FC<{ item: MashupItemBase }>;
	addedCellCount?: number;
}[] = [
	{
		key: 'character-details',
		label: '',
		filter: (item) =>
			item.type === 'class' || item.type === 'race' || item.type === 'paragonPath' || item.type === 'epicDestiny',
	},
	{
		key: 'race-feature',
		label: 'Racial Feature',
		filter: (item) => isFeature(item) && item.data.data.featureType === 'race-feature',
		header: FeatureHeader,
		body: FeatureBody as React.FC<{ item: MashupItemBase }>,
		addedCellCount: 1,
	},
	{
		key: 'class-feature',
		label: 'Class Feature',
		filter: (item) => isFeature(item) && item.data.data.featureType === 'class-feature',
		header: FeatureHeader,
		body: FeatureBody as React.FC<{ item: MashupItemBase }>,
		addedCellCount: 1,
	},
	{
		key: 'paragon-feature',
		label: 'Paragon Path Feature',
		filter: (item) => isFeature(item) && item.data.data.featureType === 'paragon-feature',
		header: FeatureHeader,
		body: FeatureBody as React.FC<{ item: MashupItemBase }>,
		addedCellCount: 1,
	},
	{
		key: 'epic-feature',
		label: 'Epic Destiny Feature',
		filter: (item) => isFeature(item) && item.data.data.featureType === 'epic-feature',
		header: FeatureHeader,
		body: FeatureBody as React.FC<{ item: MashupItemBase }>,
		addedCellCount: 1,
	},
];

export function Features({ actor }: { actor: SpecificActor }) {
	const nonEquipment = actor.items.contents.filter(
		(i) => i.type !== 'equipment' && i.type !== 'power' && (!isFeature(i) || i.data.data.featureType !== 'feat')
	);
	const groups = features
		.map(({ filter, ...others }) => ({
			...others,
			items: actor.items.filter(filter),
		}))
		.filter(({ items }) => items.length > 0);
	const other = nonEquipment.filter((item) => !features.some(({ filter }) => filter(item)));
	return (
		<>
			{groups.map(({ key, label, items, header, body, addedCellCount }) => (
				<ItemTable key={key} items={items} title={label} header={header} body={body} addedCellCount={addedCellCount} />
			))}
			{other.length ? <ItemTable items={other} title="Other" /> : null}
		</>
	);
}

function FeatureHeader() {
	return <th className="text-left">Summary</th>;
}

function FeatureBody({ item }: { item: MashupItemFeature }) {
	return <td className="text-left">{item.data.data.summary}</td>;
}
