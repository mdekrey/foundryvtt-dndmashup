import { MashupPower } from './config';
import { PowerEditor } from './components/PowerEditor';

export function PowerSheet({ item }: { item: MashupPower }) {
	return (
		<>
			<PowerEditor item={item} />
		</>
	);
}
