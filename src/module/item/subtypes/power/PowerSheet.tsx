import { Draft } from 'immer';
import { WritableDraft } from 'immer/dist/types/types-external';
import { FormInput, SelectItem } from 'src/components/form-input';
import { applyLens, documentAsState } from 'src/components/form-input/hooks/useDocumentAsState';
import { ImageEditor } from 'src/components/image-editor';
import { SourceDataOf } from 'src/core/foundry';
import { Lens } from 'src/core/lens';
import { AttackEffectFields } from './AttackEffectFields';
import { AttackRollFields } from './AttackRollFields';
import { MashupPower } from './config';
import { ActionType, EffectTypeAndRange, PowerUsage, PowerEffect, AttackEffect, AttackRoll } from './dataSourceData';
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

const attackEffectLens = Lens.from<SourceDataOf<MashupPower>, AttackEffect | null>(
	(power) => power.data.effect.effects?.find((e): e is AttackEffect => e.type === 'attack') ?? null,
	(mutator) => (draft) => {
		draft.data.effect.effects ??= [];
		const attackIndex = draft.data.effect.effects.findIndex((e): e is Draft<AttackEffect> => e.type === 'attack');
		const oldAttackEffect = (draft.data.effect.effects[attackIndex] as WritableDraft<AttackEffect> | undefined) ?? null;
		const attackEffect = mutator(oldAttackEffect);
		if (!attackEffect) {
			draft.data.effect.effects = draft.data.effect.effects.filter((e) => e.type !== 'attack');
			return;
		}
		if (attackIndex === -1) {
			draft.data.effect.effects.unshift(attackEffect);
		} else {
			draft.data.effect.effects[attackIndex] = attackEffect;
		}
	}
);

const attackRollLens = Lens.from<AttackEffect | null, AttackRoll | null>(
	(attackEffect) => attackEffect?.attackRoll ?? null,
	(mutator) => (draft) => {
		const oldAttackRoll = draft?.attackRoll ?? null;
		const newAttackRoll = mutator(oldAttackRoll);
		if (!newAttackRoll) {
			return null;
		}
		const attackEffect = draft;
		if (attackEffect === null) {
			return { type: 'attack', attackRoll: newAttackRoll, hit: [], miss: [] };
		} else {
			attackEffect.attackRoll = newAttackRoll;
		}
	}
);

const keywordsLens = Lens.from<SourceDataOf<MashupPower>, string>(
	(power) => power.data.keywords.map((k) => k.capitalize()).join(', '),
	(mutator) => (draft) => {
		const keywords = mutator(draft.data.keywords.map((k) => k.capitalize()).join(', '));
		draft.data.keywords = keywords
			.split(',')
			.map((k) => k.toLowerCase().trim())
			.filter((v) => v.length > 0);
	}
);

const attackEffectRequiredLens = Lens.from<AttackEffect | null, AttackEffect>(
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	(attackEffect) => attackEffect!,
	(mutator) => (draft) => {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return mutator(draft!);
	}
);

export function PowerSheet({ item }: { item: MashupPower }) {
	const documentState = documentAsState(item);
	console.log(documentState.value);

	const keywordsState = applyLens(documentState, keywordsLens);
	const attackEffectState = applyLens(documentState, attackEffectLens);

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
				<div className="grid grid-cols-12 gap-x-1 items-end">
					<FormInput className="col-span-6">
						<FormInput.AutoSelect document={item} field="data.usage" options={usageOptions} />
						<FormInput.Label>Usage</FormInput.Label>
					</FormInput>
					<FormInput className="col-span-6">
						<FormInput.TextField {...keywordsState} />
						<FormInput.Label>Keywords</FormInput.Label>
					</FormInput>
					<FormInput className="col-span-4">
						<FormInput.AutoSelect document={item} field="data.actionType" options={actionTypeOptions} />
						<FormInput.Label>Action Type</FormInput.Label>
					</FormInput>
					<div className="col-span-8">
						<TypeAndRange {...applyLens(documentState, typeAndRangeLens)} />
					</div>

					<FormInput className="col-span-12">
						<FormInput.AutoTextField document={item} field="data.effect.target" />
						<FormInput.Label>Target</FormInput.Label>
					</FormInput>

					<div className="col-span-12">
						<AttackRollFields {...applyLens(attackEffectState, attackRollLens)} />
					</div>

					<FormInput className="col-span-12">
						<FormInput.AutoTextField document={item} field="data.requirement" />
						<FormInput.Label>Requirement</FormInput.Label>
					</FormInput>

					<FormInput className="col-span-12">
						<FormInput.AutoTextField document={item} field="data.prerequisite" />
						<FormInput.Label>Prerequisite</FormInput.Label>
					</FormInput>
				</div>
				{attackEffectState.value ? (
					<AttackEffectFields {...applyLens(attackEffectState, attackEffectRequiredLens)} />
				) : null}
			</div>
		</>
	);
}
