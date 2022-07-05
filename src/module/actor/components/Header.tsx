import { FormInput } from 'src/components/form-input';
import { ImageEditor } from 'src/components/image-editor';
import { MashupItemBase } from 'src/module/item/mashup-item';
import { SpecificActor } from '../mashup-actor';
import { SourceDataOf } from 'src/core/foundry';
import { Lens } from 'src/core/lens';
import { documentAsState } from 'src/components/form-input/hooks/useDocumentAsState';

const baseLens = Lens.identity<SourceDataOf<SpecificActor<'pc'>>>();
const imageLens = baseLens.toField('img');
const detailsLens = baseLens.toField('data').toField('details');

export function Header({ actor }: { actor: SpecificActor<'pc'> }) {
	const documentState = documentAsState(actor);

	function showItem(item: MashupItemBase | undefined | null) {
		item?.sheet?.render(true);
	}

	return (
		<>
			<ImageEditor {...imageLens.apply(documentState)} title={actor.data.name} />
			<div className="grid grid-cols-12 grid-rows-2 gap-x-1 text-lg flex-grow">
				<FormInput className="col-span-5">
					<FormInput.TextField {...baseLens.toField('name').apply(documentState)} />
					<FormInput.Label>Character Name</FormInput.Label>
				</FormInput>
				<FormInput className="col-span-3">
					<FormInput.FieldButton onClick={() => showItem(actor.appliedRace)}>
						{actor.appliedRace?.name}
					</FormInput.FieldButton>
					<FormInput.Label>Race</FormInput.Label>
				</FormInput>
				<FormInput className="col-span-3">
					<FormInput.FieldButton onClick={() => showItem(actor.appliedClass)}>
						{actor.appliedClass?.name}
					</FormInput.FieldButton>
					<FormInput.Label>Class</FormInput.Label>
				</FormInput>
				<FormInput>
					<FormInput.NumberField
						{...detailsLens.toField('level').apply(documentState)}
						className="text-lg text-center"
					/>
					<FormInput.Label>Level</FormInput.Label>
				</FormInput>
				<FormInput className="col-span-5">
					<FormInput.FieldButton onClick={() => showItem(actor.appliedParagonPath)}>
						{actor.appliedParagonPath?.name}
					</FormInput.FieldButton>
					<FormInput.Label>Paragon Path</FormInput.Label>
				</FormInput>
				<FormInput className="col-span-5">
					<FormInput.FieldButton onClick={() => showItem(actor.appliedEpicDestiny)}>
						{actor.appliedEpicDestiny?.name}
					</FormInput.FieldButton>
					<FormInput.Label>Epic Destiny</FormInput.Label>
				</FormInput>
				<FormInput className="col-span-2">
					<FormInput.NumberField {...detailsLens.toField('exp').apply(documentState)} className="text-lg text-center" />
					<FormInput.Label>EXP</FormInput.Label>
				</FormInput>
			</div>
		</>
	);
}
