import { SpecificActor } from 'src/module/actor/mashup-actor';
import { PowerPreview } from 'src/module/item/subtypes/power/components/PowerPreview';
import { MashupPower } from 'src/module/item/subtypes/power/config';

export function PowerChat({ item, actor }: { item: MashupPower; actor: SpecificActor }) {
	return (
		<div className="flex flex-col items-center">
			<div className="max-w-sm mx-auto border-4 border-white">
				<PowerPreview item={item} />
			</div>
			<hr className="border-b border-black w-full my-1" />
			<button>Roll me</button>
		</div>
	);
}
