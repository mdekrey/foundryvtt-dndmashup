import { FormInput } from 'src/components/form-input';
import { documentAsState } from 'src/components/form-input/hooks/useDocumentAsState';
import { ImageEditor } from 'src/components/image-editor';
import { AttackEffectFields } from './AttackEffectFields';
import { AttackRollFields } from './AttackRollFields';
import { MashupPower } from '../config';
import { TypeAndRange } from './TypeAndRange';
import { usageOptions } from './usageOptions';
import { actionTypeOptions } from './actionTypeOptions';
import {
	attackEffectLens,
	attackEffectRequiredLens,
	attackRollLens,
	canHaveSecondaryAttack,
	effectTextLens,
	keywordsLens,
	powerEffectLens,
	secondaryAttackLens,
	secondaryTargetLens,
	typeAndRangeLens,
	targetTextLens,
	canHaveTertiaryAttack,
	tertiaryTargetLens,
	tertiaryAttackLens,
	nameLens,
	powerTypeLens,
	powerFlavorTextLens,
	powerUsageLens,
	powerActionTypeLens,
	powerEffectTargetLens,
	powerRequirementLens,
	powerPrerequisiteLens,
} from './sheetLenses';
import classNames from 'classnames';

export function PowerEditor({ item }: { item: MashupPower }) {
	const documentState = documentAsState(item, { deleteData: true });

	const nameState = nameLens.apply(documentState);
	const powerTypeState = powerTypeLens.apply(documentState);
	const powerFlavorTextState = powerFlavorTextLens.apply(documentState);
	const powerUsageState = powerUsageLens.apply(documentState);
	const powerActionTypeState = powerActionTypeLens.apply(documentState);
	const powerEffectTargetState = powerEffectTargetLens.apply(documentState);
	const powerRequirementState = powerRequirementLens.apply(documentState);
	const powerPrerequisiteState = powerPrerequisiteLens.apply(documentState);

	const keywordsState = keywordsLens.apply(documentState);
	const attackEffectState = attackEffectLens.apply(documentState);
	const effectTextState = effectTextLens.apply(documentState);
	const secondaryTargetState = powerEffectLens.combine(secondaryTargetLens).apply(documentState);
	const secondaryAttackState = powerEffectLens.combine(secondaryAttackLens).apply(documentState);
	const tertiaryTargetState = powerEffectLens.combine(tertiaryTargetLens).apply(documentState);
	const tertiaryAttackState = powerEffectLens.combine(tertiaryAttackLens).apply(documentState);

	return (
		<>
			<div className="h-full flex flex-col gap-1">
				<div className="flex flex-row gap-1">
					<ImageEditor document={item} field="img" title={item.name} className="w-24 h-24 border-2 border-black p-px" />
					<div className="grid grid-cols-12 grid-rows-2 gap-x-1 items-end flex-grow">
						<FormInput className="col-span-8">
							<FormInput.TextField {...nameState} className="text-lg" />
							<FormInput.Label>Power Name</FormInput.Label>
						</FormInput>
						<FormInput className="col-span-4">
							<FormInput.TextField {...powerTypeState} className="text-lg" />
							<FormInput.Label>Power Type</FormInput.Label>
						</FormInput>
						<FormInput className="col-span-12">
							<FormInput.TextField {...powerFlavorTextState} />
							<FormInput.Label>Flavor Text</FormInput.Label>
						</FormInput>
					</div>
				</div>
				<div className="grid grid-cols-12 gap-x-1 items-end">
					<FormInput className="col-span-6">
						<FormInput.Select {...powerUsageState} options={usageOptions} />
						<FormInput.Label>Usage</FormInput.Label>
					</FormInput>
					<FormInput className="col-span-6 self-end">
						<FormInput.TextField {...keywordsState} />
						<FormInput.Label>Keywords</FormInput.Label>
					</FormInput>
					<FormInput className="col-span-4">
						<FormInput.Select {...powerActionTypeState} options={actionTypeOptions} />
						<FormInput.Label>Action Type</FormInput.Label>
					</FormInput>
					<div className="col-span-8">
						<TypeAndRange {...typeAndRangeLens.apply(documentState)} />
					</div>
				</div>

				<FormInput>
					<FormInput.TextField {...powerEffectTargetState} />
					<FormInput.Label>Target</FormInput.Label>
				</FormInput>

				<AttackRollFields {...attackRollLens.apply(attackEffectState)} />

				<FormInput
					className={classNames({
						'opacity-50 focus-within:opacity-100': !item.data.data.requirement,
					})}>
					<FormInput.TextField {...powerRequirementState} />
					<FormInput.Label>Requirement</FormInput.Label>
				</FormInput>

				<FormInput
					className={classNames({
						'opacity-50 focus-within:opacity-100': !item.data.data.prerequisite,
					})}>
					<FormInput.TextField {...powerPrerequisiteState} />
					<FormInput.Label>Prerequisite</FormInput.Label>
				</FormInput>
				{attackEffectState.value ? <AttackEffectFields {...attackEffectRequiredLens.apply(attackEffectState)} /> : null}
				<FormInput
					className={classNames({
						'opacity-50 focus-within:opacity-100': !effectTextState.value,
					})}>
					<FormInput.TextField {...effectTextState} />
					<FormInput.Label>Effect</FormInput.Label>
				</FormInput>
				{canHaveSecondaryAttack(item.data.data.effect) ? (
					<>
						<FormInput>
							<FormInput.TextField {...targetTextLens.apply(secondaryTargetState)} />
							<FormInput.Label>Secondary Target</FormInput.Label>
						</FormInput>

						<AttackRollFields {...attackRollLens.apply(secondaryAttackState)} />
						{secondaryAttackState.value ? (
							<AttackEffectFields {...attackEffectRequiredLens.apply(secondaryAttackState)} />
						) : null}
					</>
				) : null}
				{canHaveTertiaryAttack(item.data.data.effect) ? (
					<>
						<FormInput>
							<FormInput.TextField {...targetTextLens.apply(tertiaryTargetState)} />
							<FormInput.Label>Tertiary Target</FormInput.Label>
						</FormInput>

						<AttackRollFields {...attackRollLens.apply(tertiaryAttackState)} />
						{tertiaryAttackState.value ? (
							<AttackEffectFields {...attackEffectRequiredLens.apply(tertiaryAttackState)} />
						) : null}
					</>
				) : null}
			</div>
		</>
	);
}
