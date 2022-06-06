import { isFeature } from 'src/module/item/subtypes';
import { MashupItemFeature } from 'src/module/item/subtypes/feature/config';
import { SpecificActor } from '../mashup-actor';
import { ItemTable } from 'src/components/ItemTable';

export function Feats({ actor }: { actor: SpecificActor }) {
	return (
		<ItemTable
			items={actor.items.filter(isFeature).filter((item) => item.data.data.featureType === 'feat')}
			title="Feat"
			header={FeatureHeader}
			body={FeatureBody}
		/>
	);
}

function FeatureHeader() {
	return <th className="text-left">Summary</th>;
}

function FeatureBody({ item }: { item: MashupItemFeature }) {
	return <td className="text-left">{item.data.data.summary}</td>;
}
