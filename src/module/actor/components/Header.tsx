import { FormInput } from 'src/components/form-input';
import { ImageEditor } from 'src/components/image-editor';
import { SpecificItem } from 'src/module/item/mashup-item';
import { SpecificActor } from '../mashup-actor';

export function Header({ actor }: { actor: SpecificActor<'pc'> }) {
	function showItem(item: SpecificItem | undefined | null) {
		item?.sheet?.render(true);
	}

	return (
		<>
			<ImageEditor src={actor.data.img} title={actor.data.name} />
			<div className="grid grid-cols-12 grid-rows-2 gap-x-1 text-lg">
				<FormInput className="col-span-5">
					<FormInput.AutoTextField document={actor} field="name" />
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
					<FormInput.AutoNumberField<SpecificActor<'pc'>> field="data.details.level" className="text-lg text-center" />
					<FormInput.Label>Level</FormInput.Label>
				</FormInput>
				<FormInput className="col-span-5">
					<FormInput.FieldButton onClick={() => showItem(null) /* data.appliedParagonPath.id */}>
						{/* TODO: data.appliedParagonPath?.name */}
					</FormInput.FieldButton>
					<FormInput.Label>Paragon Path</FormInput.Label>
				</FormInput>
				<FormInput className="col-span-5">
					<FormInput.FieldButton onClick={() => showItem(null) /* data.appliedEpicDestiny.id */}>
						{/* TODO: data.appliedEpicDestiny?.name */}
					</FormInput.FieldButton>
					<FormInput.Label>Epic Destiny</FormInput.Label>
				</FormInput>
				<FormInput className="col-span-2">
					<FormInput.AutoNumberField<SpecificActor<'pc'>> field="data.details.exp" className="text-lg text-center" />
					<FormInput.Label>EXP</FormInput.Label>
				</FormInput>
			</div>
		</>
	);
}
