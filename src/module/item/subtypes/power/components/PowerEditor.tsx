import { FormInput } from 'src/components/form-input';
import { applyLens, documentAsState } from 'src/components/form-input/hooks/useDocumentAsState';
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
} from './sheetLenses';
import classNames from 'classnames';

export function PowerEditor({ item }: { item: MashupPower }) {
	const documentState = documentAsState(item, { deleteData: true });
	console.log(documentState.value);

	const keywordsState = applyLens(documentState, keywordsLens);
	const attackEffectState = applyLens(documentState, attackEffectLens);
	const effectTextState = applyLens(documentState, effectTextLens);
	const secondaryTargetState = applyLens(documentState, powerEffectLens.combine(secondaryTargetLens));
	const secondaryAttackState = applyLens(documentState, powerEffectLens.combine(secondaryAttackLens));
	const tertiaryTargetState = applyLens(documentState, powerEffectLens.combine(tertiaryTargetLens));
	const tertiaryAttackState = applyLens(documentState, powerEffectLens.combine(tertiaryAttackLens));

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
				</div>

				<FormInput>
					<FormInput.AutoTextField document={item} field="data.effect.target" />
					<FormInput.Label>Target</FormInput.Label>
				</FormInput>

				<AttackRollFields {...applyLens(attackEffectState, attackRollLens)} />

				<FormInput
					className={classNames({
						'opacity-50 focus-within:opacity-100': !item.data.data.requirement,
					})}>
					<FormInput.AutoTextField document={item} field="data.requirement" />
					<FormInput.Label>Requirement</FormInput.Label>
				</FormInput>

				<FormInput
					className={classNames({
						'opacity-50 focus-within:opacity-100': !item.data.data.prerequisite,
					})}>
					<FormInput.AutoTextField document={item} field="data.prerequisite" />
					<FormInput.Label>Prerequisite</FormInput.Label>
				</FormInput>
				{attackEffectState.value ? (
					<AttackEffectFields {...applyLens(attackEffectState, attackEffectRequiredLens)} />
				) : null}
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
							<FormInput.TextField {...applyLens(secondaryTargetState, targetTextLens)} />
							<FormInput.Label>Secondary Target</FormInput.Label>
						</FormInput>

						<AttackRollFields {...applyLens(secondaryAttackState, attackRollLens)} />
						{secondaryAttackState.value ? (
							<AttackEffectFields {...applyLens(secondaryAttackState, attackEffectRequiredLens)} />
						) : null}
					</>
				) : null}
				{canHaveTertiaryAttack(item.data.data.effect) ? (
					<>
						<FormInput>
							<FormInput.TextField {...applyLens(tertiaryTargetState, targetTextLens)} />
							<FormInput.Label>Tertiary Target</FormInput.Label>
						</FormInput>

						<AttackRollFields {...applyLens(tertiaryAttackState, attackRollLens)} />
						{tertiaryAttackState.value ? (
							<AttackEffectFields {...applyLens(tertiaryAttackState, attackEffectRequiredLens)} />
						) : null}
					</>
				) : null}
			</div>
		</>
	);
}
