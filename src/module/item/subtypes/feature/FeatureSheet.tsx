import { FormInput } from 'src/components/form-input';
import { ImageEditor } from 'src/components/image-editor';
import { Bonuses } from '../../components/bonuses';
import { featureTypes, MashupItemFeature } from './config';

const options = Object.entries(featureTypes).map(([key, { label: label }]) => ({ value: key, key, label }));

export function FeatureSheet({ item }: { item: MashupItemFeature }) {
	return (
		<div className="h-full flex flex-col gap-1">
			<div className="flex flex-row gap-1">
				<ImageEditor document={item} field="img" title={item.name} className="w-24 h-24 border-2 border-black p-px" />
				<div className="grid grid-cols-12 grid-rows-2 gap-x-1 items-end flex-grow">
					<FormInput className="col-span-10">
						<FormInput.AutoTextField document={item} field="name" className="text-lg" />
						<FormInput.Label>Feature Name</FormInput.Label>
					</FormInput>
					<FormInput className="col-span-2">
						<FormInput.Field>
							<FormInput.AutoSelect document={item} options={options} field="data.featureType" />
						</FormInput.Field>
						<FormInput.Label>Type</FormInput.Label>
					</FormInput>
					<FormInput className="col-span-12">
						<FormInput.AutoTextField document={item} field="data.summary" className="text-lg" />
						<FormInput.Label>Summary</FormInput.Label>
					</FormInput>
				</div>
			</div>
			<div className="border-b border-black"></div>
			<Bonuses document={item} field="data.grantedBonuses" className="flex-grow" />
		</div>
	);
}
