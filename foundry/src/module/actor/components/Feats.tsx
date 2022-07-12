import { ItemTable } from 'src/components/ItemTable';
import { isFeature } from 'src/module/item/subtypes/feature/isFeature';
import { SimpleDocument } from 'dndmashup-react/core/interfaces/simple-document';
import { FeatureDocument } from 'src/module/item/subtypes/feature/dataSourceData';

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
