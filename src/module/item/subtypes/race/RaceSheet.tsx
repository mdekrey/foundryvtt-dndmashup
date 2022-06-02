import { FormInput } from 'src/components/form-input';
import { ImageEditor } from 'src/components/image-editor';
import { Bonuses } from '../../components/bonuses';
import { MashupItemRace } from './config';

export function RaceSheet({ item }: { item: MashupItemRace }) {
	return (
		<div className="h-full flex flex-col gap-1">
			<div className="flex flex-row gap-1">
				<ImageEditor document={item} field="img" title={item.name} className="w-24 h-24 border-2 border-black p-px" />
				<div className="grid grid-cols-12 grid-rows-2 gap-x-1 items-end flex-grow">
					<FormInput className="col-span-12">
						<FormInput.AutoTextField document={item} field="name" className="text-lg" />
						<FormInput.Label>Race Name</FormInput.Label>
					</FormInput>
					<FormInput className="col-span-2">
						<FormInput.Field>
							<div className="flex items-baseline">
								<FormInput.AutoNumberField
									plain
									document={item}
									field="data.baseSpeed"
									className="text-lg text-center min-w-0 flex-shrink"></FormInput.AutoNumberField>
								<span>sq.</span>
							</div>
						</FormInput.Field>
						<FormInput.Label>Base Speed</FormInput.Label>
					</FormInput>
				</div>
			</div>
			<div className="border-b border-black"></div>
			<Bonuses document={item} field="data.grantedBonuses" className="flex-grow" />
		</div>
	);
}
