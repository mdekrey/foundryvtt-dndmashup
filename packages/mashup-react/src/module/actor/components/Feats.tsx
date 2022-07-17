import { isFeature } from '../../item/subtypes/feature/isFeature';
import { ItemTable, SimpleDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { FeatureDocument } from '../../item/subtypes/feature/dataSourceData';

export function Feats({ items }: { items: SimpleDocument[] }) {
	return (
		<ItemTable
			items={items.filter<FeatureDocument>(isFeature).filter((item) => item.data.data.featureType === 'feat')}
			title="Feat"
			header={FeatureHeader}
			body={FeatureBody}
			addedCellCount={1}
		/>
	);
}

function FeatureHeader() {
	return <th className="text-left">Summary</th>;
}

function FeatureBody({ item }: { item: FeatureDocument }) {
	return <td className="text-left">{item.data.data.summary}</td>;
}
