import { FormInput } from '@foundryvtt-dndmashup/components';
import { Lens, Stateful } from '@foundryvtt-dndmashup/mashup-core';
import { PcDetails } from '../types';
import { RaceDocument } from '../../item/subtypes/race/dataSourceData';
import { SimpleDocument } from '@foundryvtt-dndmashup/foundry-compat';
import { ClassDocument } from '../../item/subtypes/class/dataSourceData';
import { ParagonPathDocument } from '../../item/subtypes/paragonPath/dataSourceData';
import { EpicDestinyDocument } from '../../item/subtypes/epicDestiny/dataSourceData';

const detailsLens = Lens.identity<PcDetails>();

export function Header({
	nameState,
	imageState,
	detailsState,

	appliedRace,
	appliedClass,
	appliedParagonPath,
	appliedEpicDestiny,
}: {
	nameState: Stateful<string>;
	imageState: Stateful<string | null>;
	detailsState: Stateful<PcDetails>;

	appliedRace: RaceDocument | undefined;
	appliedClass: ClassDocument | undefined;
	appliedParagonPath: ParagonPathDocument | undefined;
	appliedEpicDestiny: EpicDestinyDocument | undefined;
}) {
	function showItem(item: SimpleDocument | undefined | null) {
		item?.showEditDialog();
	}

	return (
		<>
			<FormInput.ImageEditor {...imageState} title={nameState.value} />
			<div className="grid grid-cols-12 grid-rows-2 gap-x-1 text-lg flex-grow">
				<FormInput className="col-span-5">
					<FormInput.TextField {...nameState} />
					<FormInput.Label>Character Name</FormInput.Label>
				</FormInput>
				<FormInput className="col-span-3">
					<FormInput.FieldButton onClick={() => showItem(appliedRace)}>{appliedRace?.name}</FormInput.FieldButton>
					<FormInput.Label>Race</FormInput.Label>
				</FormInput>
				<FormInput className="col-span-3">
					<FormInput.FieldButton onClick={() => showItem(appliedClass)}>{appliedClass?.name}</FormInput.FieldButton>
					<FormInput.Label>Class</FormInput.Label>
				</FormInput>
				<FormInput>
					<FormInput.NumberField
						{...detailsLens.toField('level').apply(detailsState)}
						className="text-lg text-center"
					/>
					<FormInput.Label>Level</FormInput.Label>
				</FormInput>
				<FormInput className="col-span-5">
					<FormInput.FieldButton onClick={() => showItem(appliedParagonPath)}>
						{appliedParagonPath?.name}
					</FormInput.FieldButton>
					<FormInput.Label>Paragon Path</FormInput.Label>
				</FormInput>
				<FormInput className="col-span-5">
					<FormInput.FieldButton onClick={() => showItem(appliedEpicDestiny)}>
						{appliedEpicDestiny?.name}
					</FormInput.FieldButton>
					<FormInput.Label>Epic Destiny</FormInput.Label>
				</FormInput>
				<FormInput className="col-span-2">
					<FormInput.NumberField {...detailsLens.toField('exp').apply(detailsState)} className="text-lg text-center" />
					<FormInput.Label>EXP</FormInput.Label>
				</FormInput>
			</div>
		</>
	);
}
