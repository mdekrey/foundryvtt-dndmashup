import { isFeature } from '../../item/subtypes/feature/isFeature';
import { ItemTable } from '@foundryvtt-dndmashup/foundry-compat';
import { PossibleItemSourceData } from '../../item/item-data-types-template';
import { SimpleDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { FeatureDocument } from '../../item/subtypes/feature/dataSourceData';

const features: {
	key: React.Key;
	label: string;
	filter: (item: SimpleDocument<PossibleItemSourceData>) => boolean;
	header?: React.FC;
	body?: React.FC<{ item: SimpleDocument<PossibleItemSourceData> }>;
}[] = [
	{
		key: 'character-details',
		label: 'Name',
		filter: (item) =>
			item.type === 'class' || item.type === 'race' || item.type === 'paragonPath' || item.type === 'epicDestiny',
	},
	{
		key: 'race-feature',
		label: 'Racial Feature',
		filter: (item) => isFeature(item) && item.data.data.featureType === 'race-feature',
		header: FeatureHeader,
		body: FeatureBody as React.FC<{ item: SimpleDocument<PossibleItemSourceData> }>,
	},
	{
		key: 'class-feature',
		label: 'Class Feature',
		filter: (item) => isFeature(item) && item.data.data.featureType === 'class-feature',
		header: FeatureHeader,
		body: FeatureBody as React.FC<{ item: SimpleDocument<PossibleItemSourceData> }>,
	},
	{
		key: 'paragon-feature',
		label: 'Paragon Path Feature',
		filter: (item) => isFeature(item) && item.data.data.featureType === 'paragon-feature',
		header: FeatureHeader,
		body: FeatureBody as React.FC<{ item: SimpleDocument<PossibleItemSourceData> }>,
	},
	{
		key: 'epic-feature',
		label: 'Epic Destiny Feature',
		filter: (item) => isFeature(item) && item.data.data.featureType === 'epic-feature',
		header: FeatureHeader,
		body: FeatureBody as React.FC<{ item: SimpleDocument<PossibleItemSourceData> }>,
	},
	{
		key: 'feats',
		label: 'Feat',
		filter: (item) => isFeature(item) && item.data.data.featureType === 'feat',
		header: FeatureHeader,
		body: FeatureBody as React.FC<{ item: SimpleDocument<PossibleItemSourceData> }>,
	},
];

export function Features({ items }: { items: SimpleDocument<PossibleItemSourceData>[] }) {
	const nonEquipment = items.filter(
		(i) => i.type !== 'equipment' && i.type !== 'power' && (!isFeature(i) || i.data.data.featureType !== 'feat')
	);
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
				<ItemTable key={key} items={items} title={label} header={header} body={body} />
			))}
			{other.length ? <ItemTable items={other} title="Other" /> : null}
		</>
	);
}

function FeatureHeader() {
	return <th className="text-left">Summary</th>;
}

function FeatureBody({ item }: { item: FeatureDocument }) {
	return <td className="text-left">{item.data.data.summary}</td>;
}
