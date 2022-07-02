import { FormInput, SelectItem } from 'src/components/form-input';
import { ImageEditor } from 'src/components/image-editor';
import { Abilities, Ability } from 'src/types/types';
import { Bonuses } from 'src/module/bonuses';
import { Tabs } from 'src/components/tab-section';
import { MashupItemClass } from './config';
import { FeaturesList } from '../../components/FeaturesList';

const keyAbilitiesIndex = [0, 1, 2];
const roles = ['Striker', 'Defender', 'Leader', 'Controller'].map(
	(v): SelectItem<string> => ({ value: v, key: v, label: v, typeaheadLabel: v })
);
const abilities = Abilities.map(
	(v): SelectItem<Ability> => ({ value: v, key: v, label: v.toUpperCase(), typeaheadLabel: v.toUpperCase() })
);

export function ClassSheet({ item }: { item: MashupItemClass }) {
	return (
		<div className="h-full flex flex-col gap-1">
			<div className="flex flex-row gap-1">
				<ImageEditor document={item} field="img" title={item.name} className="w-24 h-24 border-2 border-black p-px" />
				<div className="grid grid-cols-12 grid-rows-2 gap-x-1 items-end flex-grow text-lg">
					<FormInput className="col-span-6">
						<FormInput.AutoTextField document={item} field="name" />
						<FormInput.Label>Class Name</FormInput.Label>
					</FormInput>
					<FormInput className="col-span-6">
						<FormInput.AutoSelect document={item} field="data.role" options={roles} />
						<FormInput.Label>Role</FormInput.Label>
					</FormInput>
					<FormInput className="col-span-3">
						<FormInput.AutoTextField document={item} field="data.powerSource" />
						<FormInput.Label>Power Source</FormInput.Label>
					</FormInput>
					{keyAbilitiesIndex.map((a) => (
						<FormInput className="col-span-3" key={a}>
							<FormInput.AutoSelect
								document={item}
								field={`data.keyAbilities.${a}`}
								className="text-lg"
								options={abilities}
							/>
							<FormInput.Label>Key Ability</FormInput.Label>
						</FormInput>
					))}
				</div>
			</div>
			<div className="grid grid-cols-12 gap-x-1">
				<FormInput className="col-span-2">
					<FormInput.Field>
						<div className="flex items-baseline">
							<FormInput.AutoNumberField
								document={item}
								field="data.hpBase"
								className="flex-auto text-lg text-center min-w-0"
								plain
							/>
							<span className="flex-shrink-0">+ CON</span>
						</div>
					</FormInput.Field>
					<FormInput.Label>Base HP</FormInput.Label>
				</FormInput>
				<FormInput className="col-span-2">
					<FormInput.AutoNumberField document={item} field="data.hpPerLevel" className="text-lg text-center" />
					<FormInput.Label>HP per Level</FormInput.Label>
				</FormInput>
				<FormInput className="col-span-2">
					<FormInput.AutoNumberField document={item} field="data.healingSurgesBase" className="text-lg text-center" />
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
