import { Draft } from 'immer';
import { WritableDraft } from 'immer/dist/types/types-external';
import { FormInput, SelectItem } from 'src/components/form-input';
import { applyLens, documentAsState } from 'src/components/form-input/hooks/useDocumentAsState';
import { ImageEditor } from 'src/components/image-editor';
import { SourceDataOf } from 'src/core/foundry';
import { Lens } from 'src/core/lens';
import { AttackEffectFields } from './components/AttackEffectFields';
import { AttackRollFields } from './components/AttackRollFields';
import { MashupPower } from './config';
import {
	ActionType,
	EffectTypeAndRange,
	PowerUsage,
	PowerEffect,
	AttackEffect,
	AttackRoll,
	PowerDataSourceData,
	TextEffect,
} from './dataSourceData';
import { TypeAndRange } from './components/TypeAndRange';

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

const powerSourceDataLens = Lens.from<SourceDataOf<MashupPower>, PowerDataSourceData>(
	(power) => power.data,
	(mutator) => (power) => {
		power.data = mutator(power.data);
	}
);

const powerEffectLens = powerSourceDataLens.to<PowerEffect>(
	(data) => data.effect,
	(mutator) => (data) => {
		data.effect = mutator(
			data.effect ?? { typeAndRange: { type: 'melee', range: 'weapon' }, target: 'One creature', effects: [] }
		);
	}
);

const typeAndRangeLens = powerEffectLens.to<EffectTypeAndRange>(
	(power) => power.typeAndRange,
	(mutator) => (power) => {
		power.typeAndRange = mutator(power.typeAndRange);
	}
);

const attackEffectLens = powerEffectLens.to<AttackEffect | null>(
	(power) => power.effects?.find((e): e is AttackEffect => e.type === 'attack') ?? null,
	(mutator) => (draft) => {
		draft.effects ??= [];
		const attackIndex = draft.effects.findIndex((e): e is Draft<AttackEffect> => e.type === 'attack');
		const oldAttackEffect = (draft.effects[attackIndex] as WritableDraft<AttackEffect> | undefined) ?? null;
		const attackEffect = mutator(oldAttackEffect);
		if (!attackEffect) {
			draft.effects = draft.effects.filter((e) => e.type !== 'attack');
			return;
		}
		if (attackIndex === -1) {
			draft.effects.unshift(attackEffect);
		} else {
			draft.effects[attackIndex] = attackEffect;
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

const effectTextLens = powerEffectLens.to<string>(
	(e) => e.effects.find((h): h is TextEffect => h.type === 'text')?.text ?? '',
	(mutator) => (draft) => {
		const textDraft = draft.effects.find((h): h is TextEffect => h.type === 'text');
		const text = mutator(textDraft?.text ?? '');
		if (textDraft && text) textDraft.text = text;
		else if (!text) draft.effects = draft.effects.filter((h) => h.type !== 'text');
		else draft.effects.push({ type: 'text', text });
	}
);

export function PowerSheet({ item }: { item: MashupPower }) {
	const documentState = documentAsState(item, { deleteData: true });
	console.log(documentState.value);

	const keywordsState = applyLens(documentState, keywordsLens);
	const attackEffectState = applyLens(documentState, attackEffectLens);
	const effectTextState = applyLens(documentState, effectTextLens);

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
					<FormInput className="col-span-6 self-end">
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
				<FormInput>
					<FormInput.TextField {...effectTextState} />
					<FormInput.Label>Effect</FormInput.Label>
				</FormInput>
			</div>
		</>
	);
}
