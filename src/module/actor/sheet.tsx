export function ActorSheetJsxDemo({ data }: { data: ActorSheet.Data<ActorSheet.Options> }) {
	return (
		<>
			<article className="flex flex-col h-full">
				<header className="flex flex-row gap-1">
					<img
						src={data.actor.img ?? ''}
						data-edit="img"
						title={data.actor.name ?? ''}
						className="w-24 h-24 border-2 border-black p-px"
					/>
					<div className="grid grid-cols-12 grid-rows-2 gap-x-1">
						<label className="col-span-5">
							<input
								name="name"
								type="text"
								defaultValue={data.actor.name ?? ''}
								className="w-full input-text text-lg"
							/>
							<span className="text-sm">Character Name</span>
						</label>
					</div>
				</header>
			</article>
			Yep, got the html <input defaultValue="here" />
		</>
	);
}
