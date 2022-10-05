import { FormInput, SelectItem } from '@foundryvtt-dndmashup/components';
import { abilities, Ability, DynamicList } from '@foundryvtt-dndmashup/mashup-rules';
import { BonusesEditor } from '@foundryvtt-dndmashup/mashup-rules';
import { Tabs } from '@foundryvtt-dndmashup/components';
import { FeaturesList } from '../../components/FeaturesList';
import { Lens, Stateful } from '@foundryvtt-dndmashup/core';
import { SimpleDocument, SimpleDocumentData } from '@foundryvtt-dndmashup/foundry-compat';
import { ClassData } from './dataSourceData';

const keyAbilitiesIndex = [0, 1, 2];
const roles = ['Striker', 'Defender', 'Leader', 'Controller'].map(
	(v): SelectItem<string> => ({ value: v, key: v, label: v, typeaheadLabel: v })
);
const abilitiesOptions = abilities.map(
	(v): SelectItem<Ability> => ({ value: v, key: v, label: v.toUpperCase(), typeaheadLabel: v.toUpperCase() })
);

const baseLens = Lens.identity<SimpleDocumentData<ClassData>>();
const nameLens = baseLens.toField('name');
const imageLens = baseLens.toField('img');
const dataLens = baseLens.toField('system');
const roleLens = dataLens.toField('role');
const powerSourceLens = dataLens.toField('powerSource');
const hpBaseLens = dataLens.toField('hpBase');
const hpPerLevelLens = dataLens.toField('hpPerLevel');
const healingSurgesBaseLens = dataLens.toField('healingSurgesBase');
const bonusesLens = dataLens.toField('grantedBonuses');
const dynamicListLens = dataLens.toField('dynamicList');

export function ClassSheet({
	items,
	...documentState
}: { items: SimpleDocument[] } & Stateful<SimpleDocumentData<ClassData>>) {
	return (
		<div className="h-full flex flex-col gap-1">
			<div className="flex flex-row gap-1">
				<FormInput.ImageEditor
					{...imageLens.apply(documentState)}
					title={documentState.value.name}
					className="w-24 h-24 border-2 border-black p-px"
				/>
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
								options={abilitiesOptions}
							/>
							<FormInput.Label>Key Ability</FormInput.Label>
						</FormInput>
					))}
				</div>
			</div>
			<div className="grid grid-cols-12 gap-x-1 text-lg text-center">
				<FormInput className="col-span-2">
					<FormInput.Structured>
						<FormInput.Structured.Main>
							<FormInput.NumberField {...hpBaseLens.apply(documentState)} plain />
						</FormInput.Structured.Main>
						<span className="flex-shrink-0">+ CON</span>
					</FormInput.Structured>
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
					<Tabs.NavButton tabName="features">Features</Tabs.NavButton>
				</Tabs.Nav>

				<section className="flex-grow">
					<Tabs.Tab tabName="bonuses">
						<BonusesEditor bonuses={bonusesLens.apply(documentState)} className="flex-grow" />
						<DynamicList dynamicList={dynamicListLens.apply(documentState)} />
					</Tabs.Tab>
					<Tabs.Tab tabName="features">
						<FeaturesList items={items} />
					</Tabs.Tab>
				</section>
			</Tabs>
		</div>
	);
}
