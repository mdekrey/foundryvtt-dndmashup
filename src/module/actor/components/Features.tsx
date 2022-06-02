import { isFeature } from 'src/module/item/subtypes';
import { FeatureType, MashupItemFeature } from 'src/module/item/subtypes/feature/config';
import { SpecificActor } from '../mashup-actor';
import { ItemTable } from './ItemTable';

const features: Record<Exclude<FeatureType, 'feat'>, { label: string }> = {
	'race-feature': {
		label: 'Racial Feature',
	},
	'class-feature': {
		label: 'Class Feature',
	},
	'paragon-feature': {
		label: 'Paragon Path Feature',
	},
	'epic-feature': {
		label: 'Epic Destiny Feature',
	},
};

export function Features({ actor }: { actor: SpecificActor }) {
	const groups = Object.entries(features)
		.map(([featureType, { label }]) => ({ featureType: featureType as FeatureType, label }))
		.map(({ featureType, label }) => ({
			featureType,
			label,
			items: actor.items.filter(isFeature).filter((item) => item.data.data.featureType === featureType),
		}))
		.filter(({ items }) => items.length > 0);
	return (
		<>
			{groups.map(({ featureType, label, items }) => (
				<ItemTable key={featureType} items={items} title={label} header={FeatureHeader} body={FeatureBody} />
			))}
		</>
	);
}

function FeatureHeader() {
	return <th className="text-left">Summary</th>;
}

function FeatureBody({ item }: { item: MashupItemFeature }) {
	return <td className="text-left">{item.data.data.summary}</td>;
}
