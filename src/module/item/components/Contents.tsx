import { MashupItem } from 'src/module/item/mashup-item';
import { ItemTable } from 'src/components/ItemTable';

export function Contents({ item }: { item: MashupItem }) {
	return <ItemTable items={item.items.contents.filter((i) => i.type === 'equipment')} title={'Item'} />;
}
