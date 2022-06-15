import { FormInput } from 'src/components/form-input';
import { applyLens, documentAsState } from 'src/components/form-input/hooks/useDocumentAsState';
import { ImageEditor } from 'src/components/image-editor';
import { AttackEffectFields } from './components/AttackEffectFields';
import { AttackRollFields } from './components/AttackRollFields';
import { MashupPower } from './config';
import { TypeAndRange } from './components/TypeAndRange';
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
	typeAndRangeLens,
} from './sheetLenses';
import classNames from 'classnames';

export function PowerSheet({ item }: { item: MashupPower }) {
	const documentState = documentAsState(item, { deleteData: true });
	console.log(documentState.value);

	const keywordsState = applyLens(documentState, keywordsLens);
	const attackEffectState = applyLens(documentState, attackEffectLens);
	const effectTextState = applyLens(documentState, effectTextLens);
	const secondaryAttackState = applyLens(documentState, powerEffectLens.combine(secondaryAttackLens));

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
						'opacity-50 focus-within:opacity-100': item.data.data.requirement,
					})}>
					<FormInput.AutoTextField document={item} field="data.requirement" />
					<FormInput.Label>Requirement</FormInput.Label>
				</FormInput>

				<FormInput
					className={classNames({
						'opacity-50 focus-within:opacity-100': item.data.data.prerequisite,
					})}>
					<FormInput.AutoTextField document={item} field="data.prerequisite" />
					<FormInput.Label>Prerequisite</FormInput.Label>
				</FormInput>
				{attackEffectState.value ? (
					<AttackEffectFields {...applyLens(attackEffectState, attackEffectRequiredLens)} />
				) : null}
				<FormInput
					className={classNames({
						'opacity-50 focus-within:opacity-100': effectTextState.value,
					})}>
					<FormInput.TextField {...effectTextState} />
					<FormInput.Label>Effect</FormInput.Label>
				</FormInput>
				{canHaveSecondaryAttack(item.data.data.effect) ? (
					<>
						<AttackRollFields {...applyLens(secondaryAttackState, attackRollLens)} />
						{secondaryAttackState.value ? (
							<AttackEffectFields {...applyLens(secondaryAttackState, attackEffectRequiredLens)} />
						) : null}
					</>
				) : null}
			</div>
		</>
	);
}
