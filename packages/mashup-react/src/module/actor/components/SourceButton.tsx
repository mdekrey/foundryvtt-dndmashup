export function SourceButton({
	source,
}: {
	source: { id: string | null; name: string | null; img: string | null; showEditDialog(): void };
}) {
	return (
		<button type="button" className="w-full text-left" onClick={() => source.showEditDialog()}>
			{source.img ? <img src={source.img} alt="" className="w-8 h-8 inline-block mr-2" /> : null}
			{source.name}
		</button>
	);
}
