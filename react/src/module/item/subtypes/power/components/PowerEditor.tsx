import { FormInput } from 'src/components/form-input';
import { documentAsState } from 'src/components/form-input/hooks/useDocumentAsState';
import { AttackEffectFields } from './AttackEffectFields';
import { AttackRollFields } from './AttackRollFields';
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
	imageLens,
} from './sheetLenses';
import classNames from 'classnames';
import { PowerDocument } from '../dataSourceData';

export function PowerEditor({ item }: { item: PowerDocument }) {
	const documentState = documentAsState(item, { deleteData: true });

	const attackEffectState = attackEffectLens.apply(documentState);
	const effectTextState = effectTextLens.apply(documentState);
	const secondaryAttackState = powerEffectLens.combine(secondaryAttackLens).apply(documentState);
	const tertiaryAttackState = powerEffectLens.combine(tertiaryAttackLens).apply(documentState);

	return (
		<>
			<div className="h-full flex flex-col gap-1">
				<div className="flex flex-row gap-1">
					<FormInput.ImageEditor
						{...imageLens.apply(documentState)}
						title={item.name}
						className="w-24 h-24 border-2 border-black p-px"
					/>
					<div className="grid grid-cols-12 grid-rows-2 gap-x-1 items-end flex-grow">
						<FormInput className="col-span-8">
							<FormInput.TextField {...nameLens.apply(documentState)} className="text-lg" />
							<FormInput.Label>Power Name</FormInput.Label>
						</FormInput>
						<FormInput className="col-span-4">
							<FormInput.TextField {...powerTypeLens.apply(documentState)} className="text-lg" />
							<FormInput.Label>Power Type</FormInput.Label>
						</FormInput>
						<FormInput className="col-span-12">
							<FormInput.TextField {...powerFlavorTextLens.apply(documentState)} />
							<FormInput.Label>Flavor Text</FormInput.Label>
						</FormInput>
					</div>
				</div>
				<div className="grid grid-cols-12 gap-x-1 items-end">
					<FormInput className="col-span-6">
						<FormInput.Select {...powerUsageLens.apply(documentState)} options={usageOptions} />
						<FormInput.Label>Usage</FormInput.Label>
					</FormInput>
					<FormInput className="col-span-6 self-end">
						<FormInput.TextField {...keywordsLens.apply(documentState)} />
						<FormInput.Label>Keywords</FormInput.Label>
					</FormInput>
					<FormInput className="col-span-4">
						<FormInput.Select {...powerActionTypeLens.apply(documentState)} options={actionTypeOptions} />
						<FormInput.Label>Action Type</FormInput.Label>
					</FormInput>
					<div className="col-span-8">
						<TypeAndRange {...typeAndRangeLens.apply(documentState)} />
					</div>
				</div>

				<FormInput>
					<FormInput.TextField {...powerEffectTargetLens.apply(documentState)} />
					<FormInput.Label>Target</FormInput.Label>
				</FormInput>

				<AttackRollFields {...attackRollLens.apply(attackEffectState)} />

				<FormInput
					className={classNames({
						'opacity-50 focus-within:opacity-100': !item.data.data.requirement,
					})}>
					<FormInput.TextField {...powerRequirementLens.apply(documentState)} />
					<FormInput.Label>Requirement</FormInput.Label>
				</FormInput>

				<FormInput
					className={classNames({
						'opacity-50 focus-within:opacity-100': !item.data.data.prerequisite,
					})}>
					<FormInput.TextField {...powerPrerequisiteLens.apply(documentState)} />
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
							<FormInput.TextField
								{...targetTextLens.apply(powerEffectLens.combine(secondaryTargetLens).apply(documentState))}
							/>
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
							<FormInput.TextField
								{...powerEffectLens.combine(tertiaryTargetLens).combine(targetTextLens).apply(documentState)}
							/>
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
