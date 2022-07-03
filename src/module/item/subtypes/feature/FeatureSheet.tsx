import { FormInput, SelectItem } from 'src/components/form-input';
import { ImageEditor } from 'src/components/image-editor';
import { Bonuses } from 'src/module/bonuses';
import { Tabs } from 'src/components/tab-section';
import { FeaturesList } from '../../components/FeaturesList';
import { FeatureType, featureTypes, MashupItemFeature } from './config';
import { documentAsState } from 'src/components/form-input/hooks/useDocumentAsState';
import { SourceDataOf } from 'src/core/foundry';
import { Lens } from 'src/core/lens';

const options = Object.entries(featureTypes).map(
	([key, { label: label }]): SelectItem<FeatureType> => ({
		value: key as FeatureType,
		key,
		label,
		typeaheadLabel: label,
	})
);

const baseLens = Lens.identity<SourceDataOf<MashupItemFeature>>();

export function FeatureSheet({ item }: { item: MashupItemFeature }) {
	const documentState = documentAsState(item);
	return (
		<div className="h-full flex flex-col gap-1">
			<div className="flex flex-row gap-1">
				<ImageEditor document={item} field="img" title={item.name} className="w-24 h-24 border-2 border-black p-px" />
				<div className="grid grid-cols-12 grid-rows-2 gap-x-1 items-end flex-grow text-lg">
					<FormInput className="col-span-9">
						<FormInput.TextField {...baseLens.toField('name').apply(documentState)} />
						<FormInput.Label>Feature Name</FormInput.Label>
					</FormInput>
					<FormInput className="col-span-3">
						<FormInput.Field>
							<FormInput.Select
								{...baseLens.toField('data').toField('featureType').apply(documentState)}
								options={options}
							/>
						</FormInput.Field>
						<FormInput.Label>Type</FormInput.Label>
					</FormInput>
					<FormInput className="col-span-12">
						<FormInput.TextField {...baseLens.toField('data').toField('summary').apply(documentState)} />
						<FormInput.Label>Summary</FormInput.Label>
					</FormInput>
				</div>
			</div>
			<div className="border-b border-black"></div>
			<Tabs defaultActiveTab="bonuses">
				<Tabs.Nav>
					<Tabs.NavButton tabName="bonuses">Bonuses</Tabs.NavButton>
					{item.items.contents.filter((item) => item.type !== 'equipment').length ? (
						<Tabs.NavButton tabName="features">Features</Tabs.NavButton>
					) : null}
				</Tabs.Nav>

				<section className="flex-grow">
					<Tabs.Tab tabName="bonuses">
						<Bonuses document={item} field="data.grantedBonuses" className="flex-grow" />
					</Tabs.Tab>
					<Tabs.Tab tabName="features">
						<FeaturesList item={item} />
					</Tabs.Tab>
				</section>
			</Tabs>
		</div>
	);
}
