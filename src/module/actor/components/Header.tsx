import { ImageEditor } from 'src/components/image-editor';
import { SpecificItem } from 'src/module/item/mashup-item';
import { MashupActor } from '../mashup-actor';

export function Header({ actor }: { actor: MashupActor }) {
	function showItem(item: SpecificItem | undefined | null) {
		item?.sheet?.render(true);
	}

	return (
		<>
			<ImageEditor src={actor.data.img} title={actor.data.name} />
			<div className="grid grid-cols-12 grid-rows-2 gap-x-1">
				<label className="col-span-5">
					<input
						type="text"
						defaultValue={actor.data.name ?? ''}
						onChange={(ev) => actor.update({ name: ev.target.value })}
						className="w-full input-text text-lg"
					/>
					<span className="text-sm">Character Name</span>
				</label>
				<label className="col-span-3">
					<span className="inline-block w-full input-text text-lg" onClick={() => showItem(actor.appliedRace)}>
						{actor.appliedRace?.name}&nbsp;
					</span>
					<span className="text-sm">Race</span>
				</label>
				<label className="col-span-3">
					<span className="inline-block w-full input-text text-lg" onClick={() => showItem(actor.appliedClass)}>
						{actor.appliedClass?.name}&nbsp;
					</span>
					<span className="text-sm">Class</span>
				</label>
				<label className="">
					<input
						name="data.details.level"
						type="number"
						defaultValue={actor.data.data.details.level ?? 1}
						className="w-full input-text text-lg text-center"
						data-dtype="Number"
					/>
					<span className="text-sm">Level</span>
				</label>
				<label className="col-span-5">
					<span
						className="inline-block w-full input-text text-lg"
						onClick={() => showItem(null) /* data.appliedParagonPath.id */}>
						{/* TODO: data.appliedParagonPath?.name */}
					</span>
					<span className="text-sm">Paragon Path</span>
				</label>
				<label className="col-span-5">
					<span
						className="inline-block w-full input-text text-lg"
						onClick={() => showItem(null) /* data.appliedEpicDestiny.id */}>
						{/* TODO: data.appliedEpicDestiny?.name */}
					</span>
					<span className="text-sm">Epic Destiny</span>
				</label>
				<label className="col-span-2">
					<input
						name="data.details.exp"
						type="number"
						defaultValue={'exp' in actor.data.data.details ? actor.data.data.details.exp : 0}
						className="w-full input-text text-lg text-center"
						data-dtype="Number"
					/>
					<span className="text-sm">EXP</span>
				</label>
			</div>
		</>
	);
}
