import { FormInput } from 'src/components/form-input';
import { ImageEditor } from 'src/components/image-editor';
import { Bonuses } from 'src/module/bonuses';
import { MashupEpicDestiny } from './config';

export function EpicDestinySheet({ item }: { item: MashupEpicDestiny }) {
	return (
		<div className="h-full flex flex-col gap-1">
			<div className="flex flex-row gap-1">
				<ImageEditor document={item} field="img" title={item.name} className="w-24 h-24 border-2 border-black p-px" />
				<div className="grid grid-cols-12 grid-rows-2 gap-x-1 items-end flex-grow">
					<FormInput className="col-span-12">
						<FormInput.AutoTextField document={item} field="name" className="text-lg" />
						<FormInput.Label>Epic Destiny Name</FormInput.Label>
					</FormInput>
				</div>
			</div>
			<div className="border-b border-black"></div>
			<Bonuses document={item} field="data.grantedBonuses" className="flex-grow" />
		</div>
	);
}
