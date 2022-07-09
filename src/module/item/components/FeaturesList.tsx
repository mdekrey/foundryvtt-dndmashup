import { ItemTable } from 'src/components/ItemTable';
import { SimpleDocument } from 'src/core/interfaces/simple-document';
import { FeatureData } from '../subtypes/feature/dataSourceData';
import { isFeature } from '../subtypes/feature/isFeature';
import { PossibleItemData } from '../types';

const features: {
	key: React.Key;
	label: string;
	filter: (item: SimpleDocument<PossibleItemData>) => boolean;
	header?: React.FC;
	body?: React.FC<{ item: SimpleDocument<PossibleItemData> }>;
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
		body: FeatureBody as React.FC<{ item: SimpleDocument<PossibleItemData> }>,
	},
	{
		key: 'class-feature',
		label: 'Class Feature',
		filter: (item) => isFeature(item) && item.data.data.featureType === 'class-feature',
		header: FeatureHeader,
		body: FeatureBody as React.FC<{ item: SimpleDocument<PossibleItemData> }>,
	},
	{
		key: 'paragon-feature',
		label: 'Paragon Path Feature',
		filter: (item) => isFeature(item) && item.data.data.featureType === 'paragon-feature',
		header: FeatureHeader,
		body: FeatureBody as React.FC<{ item: SimpleDocument<PossibleItemData> }>,
	},
	{
		key: 'epic-feature',
		label: 'Epic Destiny Feature',
		filter: (item) => isFeature(item) && item.data.data.featureType === 'epic-feature',
		header: FeatureHeader,
		body: FeatureBody as React.FC<{ item: SimpleDocument<PossibleItemData> }>,
	},
];

export function FeaturesList({ items }: { items: SimpleDocument<PossibleItemData>[] }) {
	const nonEquipment = items.filter((i) => i.type !== 'equipment');
	const groups = features
		.map(({ filter, ...others }) => ({
			...others,
			items: items.filter(filter),
		}))
		.filter(({ items }) => items.length > 0);
	const other = nonEquipment.filter((item) => !features.some(({ filter }) => filter(item)));
	return (
		<>
			{groups.map(({ key, label, items, header, body }) => (
				<ItemTable key={key} items={items} title={label} header={header} body={body} addedCellCount={1} />
			))}
			{other.length ? <ItemTable items={other} title="Other" /> : null}
		</>
	);
}

function FeatureHeader() {
	return <th className="text-left">Summary</th>;
}

function FeatureBody({ item }: { item: SimpleDocument<FeatureData> }) {
	return <td className="text-left">{item.data.data.summary}</td>;
}
