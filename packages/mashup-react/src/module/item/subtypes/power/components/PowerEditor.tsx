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
	sourceIdLens,
} from './sheetLenses';
import classNames from 'classnames';
import { PowerDocument, PowerEffect } from '../dataSourceData';
import { Lens, Stateful } from '@foundryvtt-dndmashup/mashup-core';
import { AttackTypeInfo } from './AttackTypeInfo';
import { useEffect, useReducer, useRef, useState } from 'react';

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
						<FormInput className="col-span-6">
							<FormInput.TextField {...nameLens.apply(documentState)} className="text-lg" />
							<FormInput.Label>Power Name</FormInput.Label>
						</FormInput>
						<FormInput className="col-span-3">
							<FormInput.TextField {...powerTypeLens.apply(documentState)} />
							<FormInput.Label>Power Type</FormInput.Label>
						</FormInput>
						<FormInput className="col-span-3">
							<FormInput.TextField {...sourceIdLens.apply(documentState)} />
							<FormInput.Label>Source ID</FormInput.Label>
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

	const toIndex = Lens.fromProp<PowerEffect[]>();

	return (
		<table className="w-full border-collapse">
			<thead className="bg-theme text-white">
				<tr>
					<th className="py-1">All Effects</th>
					<th className="py-1" />
					<th className="py-1" />
				</tr>
			</thead>
			{indexes.map((idx) => (
				<EffectRow
					key={idx}
					onRemove={onRemove(idx)}
					{...(idx === effects.length ? newEffectLens : toIndex(idx)).apply(props)}
					isNew={idx === effects.length}
				/>
			))}
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

function EffectRow({ onRemove, isNew, ...props }: { onRemove: () => void; isNew: boolean } & Stateful<PowerEffect>) {
	const [isExpanded, toggle] = useReducer((prev) => !prev, isNew ?? false);
	const [height, setHeight] = useState<number>();
	const detailRef = useRef<HTMLDivElement | null>(null);
	const { value } = props;

	useEffect(() => {
		setHeight(detailRef.current?.scrollHeight);
	}, [isNew]);

	return (
		<tbody
			key="effect-body"
			className={classNames({
				'border-t border-black': isNew,
				'even:bg-gradient-to-r from-tan-fading to-white odd:bg-white': !isNew,
			})}>
			{isNew ? null : (
				<tr key="header" className="border-b-2 border-transparent">
					<td>
						<button type="button" className="focus:ring-blue-bright-600 focus:ring-1 p-2" onClick={toggle}>
							{value.name || '<Unnamed>'}
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
			<tr key="editor" className="bg-transparent">
				<td colSpan={3}>
					<div
						ref={detailRef}
						style={{
							maxHeight: isExpanded ? height : undefined,
						}}
						className={classNames({
							'overflow-hidden max-h-0 transition-all duration-300': !isNew,
						})}>
						<div className={classNames({ 'px-4 pb-4': !isNew, 'p-4 focus-within:opacity-100 opacity-75': isNew })}>
							<PowerEffectFields {...props} />
						</div>
					</div>
				</td>
			</tr>
		</tbody>
	);
}
