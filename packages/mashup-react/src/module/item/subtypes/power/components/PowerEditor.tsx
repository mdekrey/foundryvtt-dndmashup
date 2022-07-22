import { FormInput, IconButton } from '@foundryvtt-dndmashup/components';
import { documentAsState } from '@foundryvtt-dndmashup/foundry-compat';
import {
	attackRollLens,
	HitAndMissFields,
	PowerEffectFields,
	targetLens,
	typeAndRangeLens,
} from './AttackEffectFields';
import { AttackRollFields } from './AttackRollFields';
import { TypeAndRange } from './TypeAndRange';
import { usageOptions } from './usageOptions';
import { actionTypeOptions } from './actionTypeOptions';
import {
	keywordsLens,
	nameLens,
	powerTypeLens,
	powerFlavorTextLens,
	powerUsageLens,
	powerActionTypeLens,
	powerRequirementLens,
	powerPrerequisiteLens,
	imageLens,
	firstEffectLens,
	effectsLens,
	newEffectLens,
} from './sheetLenses';
import classNames from 'classnames';
import { PowerDocument, PowerEffect } from '../dataSourceData';
import { Lens, Stateful } from '@foundryvtt-dndmashup/mashup-core';
import { AttackTypeInfo } from './AttackTypeInfo';
import { useEffect, useRef } from 'react';

export function PowerEditor({ item }: { item: PowerDocument }) {
	const documentState = documentAsState(item, { deleteData: true });

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
						<TypeAndRange {...firstEffectLens.combine(typeAndRangeLens).apply(documentState)} />
					</div>
				</div>

				<FormInput>
					<FormInput.TextField {...firstEffectLens.combine(targetLens).apply(documentState)} />
					<FormInput.Label>Target</FormInput.Label>
				</FormInput>

				<AttackRollFields {...firstEffectLens.combine(attackRollLens).apply(documentState)} />

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

				<HitAndMissFields {...firstEffectLens.apply(documentState)} />

				<EffectsTable {...effectsLens.apply(documentState)} />
			</div>
		</>
	);
}

function EffectsTable(props: Stateful<PowerEffect[]>) {
	const effects = props.value;
	const indexes = [...effects.map((_, idx) => idx), effects.length];
	indexes.unshift(); // remove the 0 index

	const toIndex = Lens.fromProp<PowerEffect[]>();

	return (
		<table className="w-full border-collapse">
			<thead className="bg-theme text-white">
				<tr>
					<th className="py-1">Additional Effects</th>
					<th className="py-1" />
					<th className="py-1" />
				</tr>
			</thead>
			{indexes.map((idx) =>
				idx === effects.length ? (
					<EffectRow key={idx} onRemove={onRemove(idx)} {...newEffectLens.apply(props)} isNew />
				) : (
					<EffectRow key={idx} onRemove={onRemove(idx)} {...toIndex(idx).apply(props)} />
				)
			)}
		</table>
	);

	function onRemove(index: number) {
		return () => {
			props.onChangeValue((effects) => {
				effects.splice(index, 1);
			});
		};
	}
}

function EffectRow({ onRemove, isNew, ...props }: { onRemove: () => void; isNew?: boolean } & Stateful<PowerEffect>) {
	const detailRef = useRef<HTMLDivElement | null>(null);
	const { value } = props;

	useEffect(() => {
		if (isNew) {
			toggle();
		}
	});

	return (
		<tbody className="even:bg-gradient-to-r from-transparent to-white odd:bg-transparent">
			{isNew ? null : (
				<tr key="header" className="border-b-2 border-transparent">
					<td>
						<button type="button" className="focus:ring-blue-bright-600 focus:ring-1 p-2" onClick={toggle}>
							{value.name}
						</button>
					</td>
					<td>
						<AttackTypeInfo typeAndRange={value.typeAndRange} isBasic={false} />
					</td>
					<td>
						<IconButton iconClassName="fa fa-minus" text="Remove" onClick={onRemove} />
					</td>
				</tr>
			)}
			<tr key="editor">
				<td colSpan={3}>
					<div
						ref={detailRef}
						className={classNames({
							'overflow-hidden max-h-0 transition-all duration-300': !isNew,
						})}>
						<div className="p-2">
							<PowerEffectFields {...props} />
						</div>
					</div>
				</td>
			</tr>
		</tbody>
	);

	function toggle() {
		if (!detailRef.current) return;
		if (detailRef.current.style.maxHeight) detailRef.current.style.maxHeight = '';
		else detailRef.current.style.maxHeight = `${detailRef.current.scrollHeight}px`;
	}
}
