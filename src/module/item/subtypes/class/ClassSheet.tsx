import { FormInput, SelectItem } from 'src/components/form-input';
import { ImageEditor } from 'src/components/image-editor';
import { Abilities, Ability } from 'src/types/types';
import { Bonuses } from 'src/module/bonuses';
import { Tabs } from 'src/components/tab-section';
import { MashupItemClass } from './config';
import { FeaturesList } from '../../components/FeaturesList';
import { documentAsState } from 'src/components/form-input/hooks/useDocumentAsState';
import { SourceDataOf } from 'src/core/foundry';
import { Lens } from 'src/core/lens';

const keyAbilitiesIndex = [0, 1, 2];
const roles = ['Striker', 'Defender', 'Leader', 'Controller'].map(
	(v): SelectItem<string> => ({ value: v, key: v, label: v, typeaheadLabel: v })
);
const abilities = Abilities.map(
	(v): SelectItem<Ability> => ({ value: v, key: v, label: v.toUpperCase(), typeaheadLabel: v.toUpperCase() })
);

const baseLens = Lens.identity<SourceDataOf<MashupItemClass>>();
const nameLens = baseLens.toField('name');
const dataLens = baseLens.toField('data');
const roleLens = dataLens.toField('role');
const powerSourceLens = dataLens.toField('powerSource');
const hpBaseLens = dataLens.toField('hpBase');
const hpPerLevelLens = dataLens.toField('hpPerLevel');
const healingSurgesBaseLens = dataLens.toField('healingSurgesBase');
const bonusesLens = dataLens.toField('grantedBonuses');

export function ClassSheet({ item }: { item: MashupItemClass }) {
	const documentState = documentAsState(item, { deleteData: true });

	return (
		<div className="h-full flex flex-col gap-1">
			<div className="flex flex-row gap-1">
				<ImageEditor document={item} field="img" title={item.name} className="w-24 h-24 border-2 border-black p-px" />
				<div className="grid grid-cols-12 grid-rows-2 gap-x-1 items-end flex-grow text-lg">
					<FormInput className="col-span-6">
						<FormInput.TextField {...nameLens.apply(documentState)} />
						<FormInput.Label>Class Name</FormInput.Label>
					</FormInput>
					<FormInput className="col-span-6">
						<FormInput.Select {...roleLens.apply(documentState)} options={roles} />
						<FormInput.Label>Role</FormInput.Label>
					</FormInput>
					<FormInput className="col-span-3">
						<FormInput.TextField {...powerSourceLens.apply(documentState)} />
						<FormInput.Label>Power Source</FormInput.Label>
					</FormInput>
					{keyAbilitiesIndex.map((a) => (
						<FormInput className="col-span-3" key={a}>
							<FormInput.Select
								{...dataLens.toField('keyAbilities').toField(a).apply(documentState)}
								options={abilities}
							/>
							<FormInput.Label>Key Ability</FormInput.Label>
						</FormInput>
					))}
				</div>
			</div>
			<div className="grid grid-cols-12 gap-x-1 text-lg text-center">
				<FormInput className="col-span-2">
					<FormInput.Field>
						<FormInput.Structured>
							<FormInput.Structured.Main>
								<FormInput.NumberField {...hpBaseLens.apply(documentState)} plain />
							</FormInput.Structured.Main>
							<span className="flex-shrink-0">+ CON</span>
						</FormInput.Structured>
					</FormInput.Field>
					<FormInput.Label>Base HP</FormInput.Label>
				</FormInput>
				<FormInput className="col-span-2">
					<FormInput.NumberField {...hpPerLevelLens.apply(documentState)} className="text-lg text-center" />
					<FormInput.Label>HP per Level</FormInput.Label>
				</FormInput>
				<FormInput className="col-span-2">
					<FormInput.NumberField {...healingSurgesBaseLens.apply(documentState)} className="text-lg text-center" />
					<FormInput.Label>Healing Surges</FormInput.Label>
				</FormInput>
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
						<Bonuses bonuses={bonusesLens.apply(documentState)} className="flex-grow" />
					</Tabs.Tab>
					<Tabs.Tab tabName="features">
						<FeaturesList item={item} />
					</Tabs.Tab>
				</section>
			</Tabs>
		</div>
	);
}
