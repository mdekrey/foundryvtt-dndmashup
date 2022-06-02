import { MashupItemBase } from 'src/module/item/mashup-item';
import { MashupItemFeature } from 'src/module/item/subtypes/feature/config';
import { SpecificActor } from '../mashup-actor';
import { ItemTable } from './ItemTable';

function isFeature(item: MashupItemBase): item is MashupItemFeature {
	return item.data.type === 'feature';
}

export function Feats({ actor }: { actor: SpecificActor }) {
	return (
		<ItemTable
			items={actor.items.filter(isFeature).filter((item) => item.data.data.featureType === 'feat')}
			title="Feat"
			header={FeatHeader}
			body={FeatBody}
		/>
	);
}

function FeatHeader() {
	return <th className="text-left">Summary</th>;
}

function FeatBody({ item }: { item: MashupItemFeature }) {
	return <td className="text-left">{item.data.data.summary}</td>;
}
