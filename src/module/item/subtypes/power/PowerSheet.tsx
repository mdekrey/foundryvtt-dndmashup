import { FormInput, SelectItem } from 'src/components/form-input';
import { applyLens, useDocumentAsState } from 'src/components/form-input/hooks/useDocumentAsState';
import { ImageEditor } from 'src/components/image-editor';
import { SourceDataOf } from 'src/core/foundry';
import { Lens } from 'src/core/lens';
import { MashupPower } from './config';
import { ActionType, EffectTypeAndRange, PowerUsage, PowerEffect } from './dataSourceData';
import { TypeAndRange } from './TypeAndRange';

const usageOptions: SelectItem<PowerUsage>[] = [
	{
		value: 'at-will',
		key: 'at-will',
		label: 'At-Will',
	},
	{
		value: 'encounter',
		key: 'encounter',
		label: 'Encounter',
	},
	{
		value: 'daily',
		key: 'daily',
		label: 'Daily',
	},
	{
		value: 'item',
		key: 'item',
		label: 'Item',
	},
	// TODO - recharge?
];
const actionTypeOptions: SelectItem<ActionType>[] = [
	{
		value: 'standard',
		key: 'standard',
		label: 'Standard',
	},
	{
		value: 'move',
		key: 'move',
		label: 'Move',
	},
	{
		value: 'minor',
		key: 'minor',
		label: 'Minor',
	},
	{
		value: 'free',
		key: 'free',
		label: 'Free',
	},
	{
		value: 'opportunity',
		key: 'opportunity',
		label: 'Opportunity',
	},
	{
		value: 'immediate',
		key: 'immediate',
		label: 'Immediate',
	},
];

const typeAndRangeLens = Lens.from<SourceDataOf<MashupPower>, EffectTypeAndRange>(
	(power) => power.data.effect?.typeAndRange,
	(mutator) => (power) => {
		power.data.effect ??= {} as PowerEffect;
		power.data.effect.typeAndRange = mutator(power.data.effect.typeAndRange);
	}
);

export function PowerSheet({ item }: { item: MashupPower }) {
	const documentState = useDocumentAsState(item);
	console.log(documentState[0]);

	const keywords = documentState[0].data.keywords.map((k) => k.capitalize()).join(', ');

	function setKeywords(keywords: string) {
		documentState[1]((draft) => {
			draft.data.keywords = keywords
				.split(',')
				.map((k) => k.toLowerCase().trim())
				.filter((v) => v.length > 0);
		});
	}

	return (
		<>
			<div className="h-full flex flex-col gap-1">
				<div className="flex flex-row gap-1">
					<ImageEditor document={item} field="img" title={item.name} className="w-24 h-24 border-2 border-black p-px" />
					<div className="grid grid-cols-12 grid-rows-2 gap-x-1 items-end flex-grow">
						<FormInput className="col-span-8">
							<FormInput.AutoTextField document={item} field="name" className="text-lg" />
							<FormInput.Label>Power Name</FormInput.Label>
						</FormInput>
						<FormInput className="col-span-4">
							<FormInput.AutoTextField document={item} field="data.type" className="text-lg" />
							<FormInput.Label>Power Type</FormInput.Label>
						</FormInput>
						<FormInput className="col-span-12">
							<FormInput.AutoTextField document={item} field="data.flavorText" />
							<FormInput.Label>Flavor Text</FormInput.Label>
						</FormInput>
					</div>
				</div>
				<div className="grid grid-cols-12 grid-rows-2 gap-x-1 items-end">
					<FormInput className="col-span-6">
						<FormInput.AutoSelect document={item} field="data.usage" options={usageOptions} />
						<FormInput.Label>Usage</FormInput.Label>
					</FormInput>
					<FormInput className="col-span-6">
						<FormInput.TextField value={keywords} onChange={(ev) => setKeywords(ev.currentTarget.value)} />
						<FormInput.Label>Keywords</FormInput.Label>
					</FormInput>
					<FormInput className="col-span-6">
						<FormInput.AutoSelect document={item} field="data.actionType" options={actionTypeOptions} />
						<FormInput.Label>Action Type</FormInput.Label>
					</FormInput>
					<FormInput className="col-span-6">
						<TypeAndRange state={applyLens(documentState, typeAndRangeLens)} />
						<FormInput.Label>Effect Type</FormInput.Label>
					</FormInput>
				</div>
			</div>
		</>
	);
}
