import { MashupItemFeature } from 'src/module/item/subtypes/feature/config';
import { SpecificActor } from '../mashup-actor';
import { ItemTable } from 'src/components/ItemTable';
import { isFeature } from 'src/module/item/subtypes/feature/isFeature';

export function Feats({ actor }: { actor: SpecificActor }) {
	return (
		<ItemTable
			items={actor.items.filter(isFeature).filter((item) => item.data.data.featureType === 'feat')}
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

function FeatureBody({ item }: { item: MashupItemFeature }) {
	return <td className="text-left">{item.data.data.summary}</td>;
}
